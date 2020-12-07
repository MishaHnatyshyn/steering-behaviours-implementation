import {Behaviour} from "../behaviour.enum";
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
        super(startLocation.x, startLocation.y, Behaviour.BULLET);
        this.characterType = Characters.BULLET;
    }

    getBehavioursMap() {
        return {
            ...super.getBehavioursMap(),
            [Behaviour.BULLET]: this.fly.bind(this)
        }
    }

    fly(objects: Character[]): Vector {
        if (Vector.dist(this.location, this.startLocation) > this.maxShotDistance) {
            this.kill();
            return new Vector(0, 0);
        }

        objects.forEach((enemy) => {
            const dist = Vector.dist(this.location, enemy.location);
            if (dist < 10 && enemy.characterType !== Characters.HUNTER) {
                enemy.kill();
                this.kill();
            }
        })

        return this.direction;
    }
}