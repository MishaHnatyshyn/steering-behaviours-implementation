import GameObject from "../model/gameObject";
import {FIELD_HEIGHT, FIELD_WIDTH} from "../constants";
import {Characters} from '../model/characters.enum';
import Character from '../model/character';
const hunter = 'images/hunter.png';
const wolf = 'images/wolf.png';
const rabbit = 'images/rabbit.png';
const deer = 'images/deer.png';

const getCharacterImage = (src) => {
    const image = new Image(20, 20);
    image.src = src;
    return image;
}

const CHARACTERS_IMAGES_MAP = {
    [Characters.HUNTER]: getCharacterImage(hunter),
    [Characters.WOLF]: getCharacterImage(wolf),
    [Characters.RABBIT]: getCharacterImage(rabbit),
    [Characters.FALLOW_DEER]: getCharacterImage(deer),
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
        if (object.characterType === Characters.BULLET) {
            this.context.beginPath()
            this.context.arc(object.location.x, object.location.y, 3, 0, 2 * Math.PI);
            this.context.fillStyle = 'red';
            this.context.fill();
            this.context.restore();
        } else {
            const image = CHARACTERS_IMAGES_MAP[object.characterType]
            const theta = object.velocity.heading + Math.PI / 2;
            this.context.save();
            this.context.translate(object.location.x - 10, object.location.y - 10);
            this.context.rotate(theta);
            this.context.drawImage(image, -10, -10, object.radius * 2, object.radius * 2);
            this.context.restore();
        }
    }

    public drawField(objects: GameObject[]): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.lineWidth = 4;
        this.context.strokeStyle = '#000'
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        objects.forEach(this.drawObject.bind(this));
    }

    public drawBulletsAmount(amount: number, textField): void {
        textField.innerText = amount;
    }
}
