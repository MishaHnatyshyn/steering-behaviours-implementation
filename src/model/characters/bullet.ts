import Character from "../character";
import {Characters} from "../characters.enum";
import Vector from "../vector";

export default class Bullet extends Character {
    public baseMaxSpeed = 20;
    private maxShotDistance = 200;

    constructor(
        public startLocation: Vector,
        public direction: Vector,
    ) {
        super(startLocation.x, startLocation.y);
        this.characterType = Characters.BULLET;
    }

    public getCurrentBehaviourForce(objects: Character[]): Vector {
        return this.fly(objects);
    }

    private fly(objects: Character[]): Vector {
        if (Vector.dist(this.location, this.startLocation) > this.maxShotDistance) {
            this.kill();
            return new Vector(0, 0);
        }

        objects.forEach((enemy) => {
            const dist = Vector.dist(this.location, enemy.location);
            if (dist < enemy.radius && enemy.characterType !== Characters.HUNTER) {
                enemy.kill();
                this.kill();
            }
        })

        return this.direction;
    }
}