import Rabbit from "./characters/rabbit";
import Character from "./character";
import Hunter from "./characters/hunter";
import Wolf from "./characters/wolf";
import {
    canvas,
    DEFAULT_DEERS_AMOUNT,
    DEFAULT_RABBITS_AMOUNT,
    DEFAULT_WOLVES_AMOUNT,
    FIELD_HEIGHT,
    FIELD_WIDTH
} from "../constants";
import Vector from "./vector";
import Field from "../view/Field";
import FallowDeer from './characters/fallowDeer';

const bulletsNumber = document.getElementById('bulletsNumber');
const bulletsAmountText = document.getElementById('bulletsAmountText');

export default class Game {
    private rabbits: Rabbit[] = []
    private wolves: Wolf[] = []
    private deers: FallowDeer[] = []
    private deerGroups: FallowDeer[][] = []
    private hunter: Hunter = null;
    private objects: Character[] = [];
    private mouse = new Vector(0, 0);

    constructor(private field: Field) {
        this.handleMouseMove();
        this.startGame();
        this.updateFrame();
    }

    public getRandIntInRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public startGame(rabbitsCount = DEFAULT_RABBITS_AMOUNT, wolvesCount = DEFAULT_WOLVES_AMOUNT, deersCount = DEFAULT_DEERS_AMOUNT): void{
        bulletsAmountText.style.display = 'block';

        const minDeerGroupsCount = Math.floor(deersCount / 8) + 1;
        const maxDeerGroupsCount = Math.floor(deersCount / 3);
        const deerGroupsCount = this.getRandIntInRange(minDeerGroupsCount, maxDeerGroupsCount);
        let deersLeft = deersCount;
        this.deerGroups = new Array(deerGroupsCount).fill(0).map((_, index) => {
            const groupsLeft = deerGroupsCount - index - 1;
            const maxAvailAbleDeers = deersLeft - 3 * groupsLeft;
            const maxDeersInGroup = Math.min(maxAvailAbleDeers, 8);
            const deersInGroup = index === deerGroupsCount - 1 ? deersLeft : this.getRandIntInRange(3, maxDeersInGroup);
            deersLeft -= deersInGroup;
            const x = Math.random() * FIELD_WIDTH;
            const y = Math.random() * FIELD_HEIGHT;
            return new Array(deersInGroup).fill(0)
                .map(() => new FallowDeer(
                    this.getRandIntInRange(x - 10, x + 10),
                    this.getRandIntInRange(y - 10, y + 10),
                    index
                    )
                )
        })

        console.log(this.deerGroups);

        this.deers = this.deerGroups.flat()


        this.rabbits = new Array(rabbitsCount).fill(0).map(() => new Rabbit(Math.random() * FIELD_WIDTH, Math.random() * FIELD_HEIGHT))
        this.wolves = new Array(wolvesCount).fill(0).map(() => new Wolf(Math.random() * FIELD_WIDTH, Math.random() * FIELD_HEIGHT))
        this.hunter = new Hunter(Math.random() * FIELD_WIDTH, Math.random() * FIELD_HEIGHT)
        this.objects = [...this.rabbits, ...this.wolves, ...this.deers];
    }

    private updateFrame(): void {
        this.objects = this.objects.filter((char) => !char.isDead);
        const characters: Character[] = [...this.objects];
        if (!this.hunter.isDead) {
            characters.push(this.hunter);
        }
        this.objects.forEach((object) => {
            object.simulateCurrentBehaviour(characters);
        })

        this.hunter.bullets = this.hunter.bullets.filter((bullet) => !bullet.isDead);

        this.hunter.bullets.forEach((bullet) => bullet.simulateCurrentBehaviour(characters));

        if (!this.hunter.isDead) {
            this.hunter.simulateCurrentBehaviour(this.mouse);
            this.field.drawBulletsAmount(this.hunter.bulletsCount, bulletsNumber);
        } else {
            bulletsAmountText.style.display = 'none';
        }
        this.field.drawField([...characters, ...this.hunter.bullets]);

        requestAnimationFrame(this.updateFrame.bind(this));
    }

    private handleMouseMove(): void {
        canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        })
    }
}
