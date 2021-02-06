import Character from '../character';
import {Characters} from '../characters.enum';
import Vector from '../vector';

export default class Wolf extends Character {
  public baseMaxSpeed: number = 5;
  public static ENEMIES = [Characters.RABBIT, Characters.FALLOW_DEER, Characters.HUNTER];
  private power = 20;
  private readonly powerTimer: number;

  private static ENEMIES_POWER_REWARD = {
    [Characters.RABBIT]: 10,
    [Characters.FALLOW_DEER]: 20,
    [Characters.HUNTER]: 20,
  }

  constructor(x, y) {
    super(x, y);
    this.characterType = Characters.WOLF;
    this.decreasePower = this.decreasePower.bind(this);
    this.powerTimer = window.setInterval(this.decreasePower, 1000);
  }

  public kill(): void {
    clearInterval(this.powerTimer)
    super.kill();
  }

  public getCurrentBehaviourForce(objects: Character[]): Vector {
    return this.hunt(objects);
  }

  private decreasePower(): void {
    this.power--;

    if (this.power === 0) {
      this.kill();
    }
  }

  private eatEnemy(enemy: Character): void {
    this.power += Wolf.ENEMIES_POWER_REWARD[enemy.characterType];
    enemy.kill();
  }

  private hunt(objects: Character[]): Vector {
    const enemies = objects.filter(object => Wolf.ENEMIES.includes(object.characterType));

    const neighborDist = this.radius * 10;

    const theNearestEnemy = enemies
      .map(enemy => ({ enemy, dist: Vector.dist(this.location, enemy.location)}))
      .filter((item) => {
        if (item.dist <= item.enemy.radius) {
          this.eatEnemy(item.enemy)
          return false;
        }
        return item.dist < neighborDist
      })
      .sort((a, b) => a.dist - b.dist)[0];
    if (theNearestEnemy) {
      return this.seek(theNearestEnemy.enemy.location);
    }

    return this.wander()
  }
}
