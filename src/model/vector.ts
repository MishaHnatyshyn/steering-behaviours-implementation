export default class Vector {
    constructor(public x, public y) {}

    public mult(value: number): void {
        this.x *= value;
        this.y *= value;
    }

    public normalize(): void {
        const length = this.length;
        if (length !== 0) {
            this.x /= length;
            this.y /= length;
        };
    }

    public get length(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    public add(vector: Vector): void {
        this.x += vector.x;
        this.y += vector.y;
    }

    public limit(maxSize: number): void {
        if (this.length > maxSize) {
            this.normalize();
            this.mult(maxSize);
        }
    }

    public clone(): Vector {
        return new Vector(this.x, this.y);
    }

    public get heading() {
        return Math.atan2(this.y, this.x);
    }

    public div(vector: Vector): void {
        this.x /= vector.x;
        this.y /= vector.y;
    }

    static dist(firstVector: Vector, secondVector: Vector): number {
        const xDiff = firstVector.x - secondVector.x;
        const yDiff = firstVector.y - secondVector.y;
        return Math.sqrt(xDiff ** 2 + yDiff ** 2);
    }

    static sum(firstVector: Vector, secondVector: Vector): Vector {
        return new Vector(firstVector.x + secondVector.x, firstVector.y + secondVector.y);
    }

    static sub(firstVector: Vector, secondVector: Vector): Vector {
        return new Vector(firstVector.x - secondVector.x, firstVector.y - secondVector.y);
    }

    static div(vector: Vector, value: number): Vector {
        return new Vector(vector.x / value, vector.y / value);
    }

}
