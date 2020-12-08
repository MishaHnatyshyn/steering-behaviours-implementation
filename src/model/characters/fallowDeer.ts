import {Characters} from '../characters.enum';
import Character from '../character';
import Vector from '../vector';

export default class FallowDeer extends Character {
  constructor(x, y, private groupId) {
    super(x, y);
    this.characterType = Characters.FALLOW_DEER;
  }

  public getCurrentBehaviourForce(objects: Character[]): Vector {
    const deers = objects.filter((object) => object instanceof FallowDeer && object?.groupId === this.groupId && object !== this)
    const wolves = objects.filter((object) => object.characterType === Characters.WOLF)
    const separationFromWolvesForce = super.separate(wolves, this.radius * 10);

    if (deers.length <= 3) return separationFromWolvesForce;

    const flockForce = super.flock(deers);

    if (flockForce.x === 0 && flockForce.y === 0) {
      if (deers.length <= 1) {
        return separationFromWolvesForce
      }

      const nearestNeighbour = deers
        .map((object) => ({ object, distance: Vector.dist(this.location, object.location)}))
        .sort((a, b) => a.distance - b.distance)[0]
        .object.location
      const seekingForNeighbourForce = this.seek(nearestNeighbour);

      return Vector.sum(separationFromWolvesForce, seekingForNeighbourForce);
    }

    // flockForce.mult(0.5);
    separationFromWolvesForce.mult(3);
    return Vector.sum(separationFromWolvesForce, flockForce);
  }
}
