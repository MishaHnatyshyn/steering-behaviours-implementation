import Character from '../character';
import {Behaviour} from '../behaviour.enum';
import {Characters} from '../characters.enum';
import Vector from '../vector';

export default class Wolf extends Character {
  public baseMaxSpeed: number = 3;
  public target: Character;
  public static ENEMIES = [Characters.RABBIT, Characters.FALLOW_DEER, Characters.HUNTER]

  constructor(x, y) {
    super(x, y, Behaviour.HUNT);
    this.characterType = Characters.WOLF;
  }

  getBehavioursMap() {
    return {
      ...super.getBehavioursMap(),
      [Behaviour.HUNT]: this.hunt.bind(this)
    }
  }

  public hunt(objects: Character[]): Vector {
    const enemies = objects.filter(object => Wolf.ENEMIES.includes(object.characterType));

    const neighborDist = 100;

    const theNearestEnemy = enemies
      .map(enemy => ({ enemy, dist: Vector.dist(this.location, enemy.location)}))
      .filter((item) => {
        if (item.dist <= 5) {
          item.enemy.kill();
          return false;
        }
        return item.dist < neighborDist
      })
      .sort((a, b) => a.dist - b.dist)[0];
    if (theNearestEnemy) {
      return this.seek(theNearestEnemy.enemy.location)
    }

    return this.wander()
  }
}
