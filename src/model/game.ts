import Rabbit from "./characters/rabbit";
import Character from "./character";
import Hunter from "./characters/hunter";
import Wolf from "./characters/wolf";
import {
    canvas,
    DEFAULT_DEERS_AMOUNT,
    DEFAULT_RABBITS_AMOUNT,
    DEFAULT_WOLVES_AMOUNT,
} from "../constants";
import Vector from "./vector";
import Field from "../view/Field";
import FallowDeer from './characters/fallowDeer';
import CharactersGenerator from "./charactersGenerator";

const bulletsNumber = document.getElementById('bulletsNumber');
const bulletsAmountText = document.getElementById('bulletsAmountText');

export default class Game {
    private rabbits: Rabbit[] = []
    private wolves: Wolf[] = []
    private deers: FallowDeer[] = []
    private hunter: Hunter = null;
    private objects: Character[] = [];
    private mouse = new Vector(0, 0);

    constructor(private field: Field) {
        this.handleMouseMove();
        this.startGame();
        this.updateFrame();
    }

    public startGame(rabbitsCount = DEFAULT_RABBITS_AMOUNT, wolvesCount = DEFAULT_WOLVES_AMOUNT, deersCount = DEFAULT_DEERS_AMOUNT): void{
        bulletsAmountText.style.display = 'block';
        this.deers = CharactersGenerator.generateDeersGroup(deersCount);
        this.rabbits = CharactersGenerator.generateRabbits(rabbitsCount);
        this.wolves = CharactersGenerator.generateWolves(wolvesCount);
        this.hunter = CharactersGenerator.generateHunter();
        this.objects = [...this.rabbits, ...this.wolves, ...this.deers];
    }

    private updateFrame(): void {
        this.objects = this.objects.filter((char) => !char.isDead);
        const characters: Character[] = [...this.objects];
        if (!this.hunter.isDead) {
            characters.push(this.hunter);
        }
        this.updateCharacters(characters);
        this.updateBullets(characters);

        if (!this.hunter.isDead) {
            this.updateHunter();
            this.field.drawBulletsAmount(this.hunter.bulletsCount, bulletsNumber);
        } else {
            bulletsAmountText.style.display = 'none';
        }
        this.field.drawField([...characters, ...this.hunter.bullets]);

        requestAnimationFrame(this.updateFrame.bind(this));
    }

    private updateBullets(characters): void {
        this.hunter.bullets = this.hunter.bullets.filter((bullet) => !bullet.isDead);
        this.hunter.bullets.forEach((bullet) => bullet.simulateCurrentBehaviour(characters));
    }

    private updateHunter(): void {
        this.hunter.simulateCurrentBehaviour(this.mouse);
    }

    private updateCharacters(characters): void {
        this.objects.forEach((object) => {
            object.simulateCurrentBehaviour(characters);
        })
    }


    private handleMouseMove(): void {
        canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        })
    }
}
