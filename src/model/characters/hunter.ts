import {Behaviour} from '../behaviour.enum';
import {Characters} from '../characters.enum';
import Character from '../character';
import Bullet from "./bullet";

export default class Hunter extends Character {
  public baseMaxSpeed: number = 2;
  public bulletsCount = 10;
  public bullets: Bullet[] = []

  constructor(x, y) {
    super(x, y, Behaviour.ARRIVE);
    this.characterType = Characters.HUNTER;
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.startListeningKeyPress();
  }

  startListeningKeyPress(): void {
    window.addEventListener('keypress', this.handleKeyPress)
  }

  handleKeyPress(e: KeyboardEvent): void {
    if (e.key === ' ' && this.bulletsCount) {
      this.shot();
    }
  }

  kill() {
    window.removeEventListener('keypress', this.handleKeyPress)
    super.kill();
  }

  shot(): void {
    const bullet = new Bullet(this.location, this.velocity)
    this.bullets.push(bullet);
    this.bulletsCount--;
  }
}
