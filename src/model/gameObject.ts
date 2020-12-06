import Vector from "./vector";
import {DANGEROUS_WALL_DISTANCE, FIELD_HEIGHT, FIELD_WIDTH} from "../constants";
import {Behaviour} from "./behaviour.enum";

const ANGLE_CHANGE = 30;

export default class GameObject {
    public maxSpeed: number = 4;
    public maxForce: number = 0.1;
    public velocity: Vector;
    public location: Vector;
    public acceleration: Vector;
    public radius: number = 5;
    public wanderAngle: number = 0;
    public currentBehaviour: Behaviour = Behaviour.WANDER;

    public BEHAVIOURS = {
        [Behaviour.SEEK]: this.seek.bind(this),
        [Behaviour.FLEE]: this.flee.bind(this),
        [Behaviour.WANDER]: this.wander.bind(this),
        [Behaviour.ARRIVE]: this.arrive.bind(this),
    }

    constructor(x: number, y: number) {
        this.acceleration = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.location = new Vector(x, y);
    }

    simulateCurrentBehaviour(target?: Vector): void {
        this.BEHAVIOURS[this.currentBehaviour](target);
        this.stayWithinWalls();
        this.update();
    }

    public applyForce(force: Vector): void {
        this.acceleration.add(force);
    }

    public update(): void {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }

    public seek(target: Vector): void {
        const desired = Vector.sub(target, this.location);
        desired.normalize();
        desired.mult(this.maxSpeed);
        const steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        this.applyForce(steer);
    }

    public flee(target: Vector): void {
        const desired = Vector.sub(target, this.location);
        desired.normalize();
        desired.mult(this.maxSpeed);
        desired.mult(-1)
        const steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        this.applyForce(steer);
    }

    public arrive(target: Vector): void {
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
        this.applyForce(steer);
    }

    public wander(): void {
        const circleCenter = this.velocity.clone();
        circleCenter.normalize();
        circleCenter.mult(5);
        const displacement = new Vector(0, -1);
        displacement.mult(20);
        this.setAngle(displacement, this.wanderAngle);
        this.wanderAngle += Math.random() > .5 ? -ANGLE_CHANGE : ANGLE_CHANGE;
        const wanderForce = Vector.sum(circleCenter, displacement);
        wanderForce.limit(this.maxForce);
        this.applyForce(wanderForce);
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
            steer.limit(this.maxForce * 2);
            this.applyForce(steer)
        }
    }

    private setAngle(vector: Vector, value: number): void {
        const length = vector.length;
        vector.x = Math.cos(value) * length;
        vector.y = Math.sin(value) * length;
    }
}