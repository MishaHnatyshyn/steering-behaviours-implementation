import Vector from "./vector";

export default class GameObject {
    public baseMaxSpeed: number = 4;
    public maxForce: number = 0.1;
    public velocity: Vector;
    public location: Vector;
    public acceleration: Vector;
    public radius: number = 5;


    public get maxSpeed(): number {
        return this.baseMaxSpeed;
    }

    constructor(x: number, y: number) {
        this.acceleration = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.location = new Vector(x, y);
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
}
