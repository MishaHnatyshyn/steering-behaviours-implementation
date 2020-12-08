import Vector from "./vector";
import {DANGEROUS_WALL_DISTANCE, FIELD_HEIGHT, FIELD_WIDTH} from "../constants";
import GameObject from './gameObject';

const ANGLE_CHANGE = 30;

export default class GameObjectWithBehaviour extends GameObject {
    public wanderAngle: number = 0;

    constructor(x: number, y: number) {
        super(x, y)
    }

    public getCurrentBehaviourForce(...ars: any[]): Vector {
        return this.wander()
    }

    public simulateCurrentBehaviour(...args: any[]): void {
        const force = this.getCurrentBehaviourForce(...args);
        this.applyForce(force)
        this.stayWithinWalls();
        this.update();
    }

    public seek(target: Vector): Vector {
        const desired = Vector.sub(target, this.location);
        desired.normalize();
        desired.mult(this.maxSpeed);
        const steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    public flee(target: Vector): Vector {
        const desired = Vector.sub(target, this.location);
        desired.normalize();
        desired.mult(this.maxSpeed);
        desired.mult(-1)
        const steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    public arrive(target: Vector): Vector {
        const desired = Vector.sub(target, this.location);
        const distance = desired.length;
        desired.normalize();

        if (distance < 100) {
            const multiplier = distance / 100 * this.maxSpeed;
            desired.mult(multiplier);
        } else {
            desired.mult(this.maxSpeed);
        }
        const steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    public wander(): Vector {
        const circleCenter = this.velocity.clone();
        circleCenter.normalize();
        circleCenter.mult(5);
        const displacement = new Vector(0, -1);
        displacement.mult(20);
        this.setAngle(displacement, this.wanderAngle);
        this.wanderAngle += Math.random() > .5 ? -ANGLE_CHANGE : ANGLE_CHANGE;
        const wanderForce = Vector.sum(circleCenter, displacement);
        wanderForce.limit(this.maxForce);
        return wanderForce;
    }

    private stayWithinWalls(): void {
        let desired: Vector;
        if (this.location.x < DANGEROUS_WALL_DISTANCE) {
            desired = new Vector(this.maxSpeed, this.velocity.y);
        } else if (this.location.x > FIELD_WIDTH - DANGEROUS_WALL_DISTANCE) {
            desired = new Vector(-this.maxSpeed, this.velocity.y);
        }

        if (this.location.y < DANGEROUS_WALL_DISTANCE) {
            desired = new Vector(this.velocity.x, this.maxSpeed);
        } else if ( this.location.y > FIELD_HEIGHT - DANGEROUS_WALL_DISTANCE) {
            desired = new Vector(this.velocity.x, -this.maxSpeed);
        }

        if (desired) {
            const steer = Vector.sub(desired, this.velocity);
            steer.limit(this.maxForce * 3.5);
            this.applyForce(steer)
        }
    }

    public separate(objects: GameObject[], separationRadius? : number): Vector {
        const desiredSeparation = separationRadius || this.radius * 5;
        const desired = new Vector(0, 0);
        let count = 0;
        objects.forEach(object => {
            const distanceToObject = Vector.dist(this.location, object.location);
            if (distanceToObject > 0 && distanceToObject < desiredSeparation) {
                const diff = Vector.sub(this.location, object.location);
                diff.normalize();
                diff.mult(1 / distanceToObject);
                desired.add(diff);
                count++;
            }
        })

        if (count > 0) {
            desired.mult(1 / count);
            desired.normalize();
            desired.mult(this.maxSpeed);
            const steer = Vector.sub(desired, this.velocity)
            steer.limit(this.maxForce);
            return steer;
        }

        return new Vector(0, 0)
    }

    protected flock(objects: GameObject[]): Vector {
        const separationForce = this.separate(objects);
        const alignmentForce = this.align(objects);
        const cohesionForce = this.cohesion(objects);

        separationForce.mult(1.3);
        alignmentForce.mult(1);
        cohesionForce.mult(1);

        const resultForce = new Vector(0, 0);
        resultForce.add(separationForce);
        resultForce.add(alignmentForce);
        resultForce.add(cohesionForce);

        return resultForce;
    }

    private align(objects: GameObject[]): Vector {
        const desired = new Vector(0, 0);
        const neighborDist = this.radius * 10;
        let count = 0;
        objects.forEach(object => {
            const distance = Vector.dist(this.location, object.location);
            if (distance > 0 && distance < neighborDist) {
                desired.add(object.velocity);
                count++;
            }
        })

        if (count > 0) {
            desired.mult(1 / count)
            desired.normalize();
            desired.mult(this.maxSpeed);
            const steer = Vector.sub(desired, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        }

        return new Vector(0, 0)
    }

    private cohesion(objects: GameObject[]): Vector {
        const desired = new Vector(0, 0);
        const neighborDist = this.radius * 10;
        let count = 0;

        objects.forEach(object => {
            const distance = Vector.dist(this.location, object.location);
            if (distance > 0 && distance < neighborDist) {
                desired.add(object.location);
                count++;
            }
        })

        if (count > 0) {
            desired.mult(1 / count);
            return this.seek(desired)
        }

        return new Vector(0, 0);
    }

    private setAngle(vector: Vector, value: number): void {
        const length = vector.length;
        vector.x = Math.cos(value) * length;
        vector.y = Math.sin(value) * length;
    }
}
