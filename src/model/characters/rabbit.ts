import {Characters} from '../characters.enum';
import Vector from '../vector';
import Character from '../character';
import GameObject from '../gameObject';

export default class Rabbit extends Character {
  public baseMaxSpeed: number = 6;

  constructor(x, y) {
    super(x, y);
    this.characterType = Characters.RABBIT;
    this.separate = this.separate.bind(this)
  }

  public getCurrentBehaviourForce(objects: GameObject[]): Vector {
    const force: Vector = super.separate(objects)
    if (force.x === 0 && force.y === 0) {
      return this.wander()
    }
    force.mult(1.1);
    return force;
  }
}
