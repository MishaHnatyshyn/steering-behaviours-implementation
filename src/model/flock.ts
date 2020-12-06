import GameObject from "./gameObject";

export default class Flock extends GameObject {
    private boids: GameObject[] = []

    addBoid(boid: GameObject): void {
        this.boids.push(boid)
    }


}