import {Behaviour} from '../behaviour.enum';
import {Characters} from '../characters.enum';
import Vector from '../vector';
import Character from '../character';
import GameObject from '../gameObject';

export default class Rabbit extends Character {
  public baseMaxSpeed: number = 6;

  constructor(x, y) {
    super(x, y, Behaviour.SEPARATE);
    this.characterType = Characters.RABBIT;
    this.separate = this.separate.bind(this)
  }

  public get maxSpeed(): number {
    return this.currentBehaviour === Behaviour.SEPARATE ? this.baseMaxSpeed * 2.5 : this.baseMaxSpeed;
  }

  public separate(objects: GameObject[]): Vector {
    const force: Vector = super.separate(objects)
    if (force.x === 0 && force.y === 0) {
      return this.wander()
    }
    force.mult(1.1);
    return force;
  }
}
