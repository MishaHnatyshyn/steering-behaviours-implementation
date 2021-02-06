import {Characters} from '../characters.enum';
import Character from '../character';
import Bullet from "./bullet";
import Vector from "../vector";
import {canvas} from './../../constants'

export default class Hunter extends Character {
  public baseMaxSpeed: number = 3;
  public bulletsCount = 10;
  public bullets: Bullet[] = []
  public radius = 13;

  constructor(x, y) {
    super(x, y);
    this.characterType = Characters.HUNTER;
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.shot = this.shot.bind(this);
    this.startListeningUserActions();
  }

  public getCurrentBehaviourForce(target: Vector): Vector {
    return this.arrive(target);
  }

  public kill(): void {
    window.removeEventListener('keypress', this.handleKeyPress);
    window.removeEventListener('click', this.shot);
    super.kill();
  }

  private startListeningUserActions(): void {
    window.addEventListener('keypress', this.handleKeyPress)
    canvas.addEventListener('click', this.shot)
  }

  private handleKeyPress(e: KeyboardEvent): void {
    if (e.key === ' ') {
      this.shot();
    }
  }

  private shot(): void {
    if(this.bulletsCount && !this.isDead) {
      const bullet = new Bullet(this.location, this.velocity.clone())
      this.bullets.push(bullet);
      this.bulletsCount--;
    }
  }
}
