import Vector from "./vector";

export default class GameObject {
    public maxSpeed: number = 4;
    public maxForce: number = 0.1;
    public velocity: Vector;
    public location: Vector;
    public mass: number;
    public acceleration: Vector;
    public radius: number = 5;

    constructor(x: number, y: number) {
        this.acceleration = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.location = new Vector(x, y);
    }

    applyForce(force: Vector): void {
        this.acceleration.add(force);
    }

    update(): void {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }

    seek(target: Vector): void {
        const desired = Vector.sub(target, this.location);
        desired.normalize();
        desired.mult(this.maxSpeed);
        const steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        this.applyForce(steer);
    }

    flee(target: Vector): void {
        const desired = Vector.sub(target, this.location);
        desired.normalize();
        desired.mult(this.maxSpeed);
        desired.mult(-1)
        const steer = Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        this.applyForce(steer);
    }
}