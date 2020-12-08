import {Characters} from '../characters.enum';
import Vector from '../vector';
import Character from '../character';
import GameObject from '../gameObject';

export default class Rabbit extends Character {
  public wanderingSpeed: number = 3;
  public separationSpeed: number = 8;

  constructor(x, y) {
    super(x, y);
    this.characterType = Characters.RABBIT;
    this.separate = this.separate.bind(this)
  }

  public getCurrentBehaviourForce(objects: GameObject[]): Vector {
    const force: Vector = super.separate(objects)
    if (force.isNull()) {
      this.baseMaxSpeed = this.wanderingSpeed;
      return this.wander()
    }
    this.baseMaxSpeed = this.separationSpeed;
    force.mult(1.1);
    return force;
  }
}
