import GameObjectWithBehaviour from './gameObjectWithBehaviour';
import {Characters} from './characters.enum';
import {FIELD_HEIGHT, FIELD_WIDTH} from "../constants";

export default class Character extends GameObjectWithBehaviour {
  public characterType: Characters;
  public isDead: boolean = false;
  public kill(): void {
    this.isDead = true;
  }

  update() {
    super.update();
    const fatalCrossDistance = this.radius * .5;
    if (
        this.location.x < fatalCrossDistance
        || this.location.x > FIELD_WIDTH - fatalCrossDistance
        || this.location.y < fatalCrossDistance
        || this.location.y > FIELD_HEIGHT - fatalCrossDistance
    ) {
      this.kill();
    }
  }
}
