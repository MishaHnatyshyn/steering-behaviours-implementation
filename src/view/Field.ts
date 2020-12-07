import GameObject from "../model/gameObject";
import {FIELD_HEIGHT, FIELD_WIDTH} from "../constants";
import {Characters} from '../model/characters.enum';
import Character from '../model/character';

const CHARACTERS_COLOR_MAP = {
    [Characters.HUNTER]: 'red',
    [Characters.WOLF]: 'gray',
    [Characters.RABBIT]: 'blue',
}

export default class Field {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    public createCanvas(): HTMLCanvasElement {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.context = this.canvas?.getContext("2d");

        this.canvas.width = FIELD_WIDTH;
        this.canvas.height = FIELD_HEIGHT;

        return this.canvas;
    }

    public drawObject(object: Character): void {
        const theta = object.velocity.heading + Math.PI / 2;
        this.context.save();
        this.context.translate(object.location.x, object.location.y);
        this.context.rotate(theta);
        this.context.beginPath();
        this.context.moveTo(0, -object.radius * 2);
        this.context.lineTo(-object.radius, object.radius * 2);
        this.context.lineTo(object.radius, object.radius * 2);
        this.context.fillStyle = CHARACTERS_COLOR_MAP[object.characterType];
        this.context.fill();
        this.context.closePath();
        this.context.restore();
    }

    public drawField(objects: GameObject[]): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.lineWidth = 4;
        this.context.strokeStyle = '#000'
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        objects.forEach(this.drawObject.bind(this));
    }
}
