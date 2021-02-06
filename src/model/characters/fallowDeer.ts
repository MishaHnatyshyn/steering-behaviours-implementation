import {Characters} from '../characters.enum';
import Character from '../character';
import Vector from '../vector';

export default class FallowDeer extends Character {
  public baseMaxSpeed: number = 4;

  constructor(x, y, private groupId) {
    super(x, y);
    this.characterType = Characters.FALLOW_DEER;
  }

  private static isFallowDeer(object: Character | FallowDeer): object is FallowDeer {
    return object.characterType === Characters.FALLOW_DEER;
  }

  private retrieveDeersFromSameGroup(objects: Character[]): Character[] {
    return objects.filter((object) => FallowDeer.isFallowDeer(object) && object?.groupId === this.groupId && object !== this)
  }

  public getCurrentBehaviourForce(objects: Character[]): Vector {
    const deers = this.retrieveDeersFromSameGroup(objects);
    const wolves = objects.filter((object) => object.characterType === Characters.WOLF)
    const separationFromWolvesForce = super.separate(wolves, this.radius * 15);

    if (deers.length <= 2 && !separationFromWolvesForce.isNull()){
      return separationFromWolvesForce;
    } else if (deers.length <= 2) {
      return this.wander();
    }

    const flockForce = super.flock(deers);

    if (flockForce.isNull()) {
      const nearestNeighbour = deers
        .map((object) => ({ object, distance: Vector.dist(this.location, object.location)}))
        .sort((a, b) => a.distance - b.distance)[0]
        .object.location
      const seekingForNeighbourForce = this.seek(nearestNeighbour);
      seekingForNeighbourForce.mult(2);

      return Vector.sum(separationFromWolvesForce, seekingForNeighbourForce);
    }

    separationFromWolvesForce.mult(3);
    return Vector.sum(separationFromWolvesForce, flockForce);
  }
}
