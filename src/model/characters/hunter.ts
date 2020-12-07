import {Behaviour} from '../behaviour.enum';
import {Characters} from '../characters.enum';
import Character from '../character';

export default class Hunter extends Character {
  public baseMaxSpeed: number = 2;

  constructor(x, y) {
    super(x, y, Behaviour.ARRIVE);
    this.characterType = Characters.HUNTER;
  }
}
