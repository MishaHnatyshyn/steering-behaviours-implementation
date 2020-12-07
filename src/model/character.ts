import GameObjectWithBehaviour from './gameObjectWithBehaviour';
import {Characters} from './characters.enum';

export default class Character extends GameObjectWithBehaviour {
  public characterType: Characters;
  public isDead: boolean = false;
  public kill(): void {
    this.isDead = true;
  }
}
