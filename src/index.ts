// import './styles/main.scss'
import Field from "./view/Field";
import GameObject from "./model/gameObject";
import Vector from "./model/vector";
import {Behaviour} from "./model/behaviour.enum";
import {FIELD_HEIGHT, FIELD_WIDTH} from "./constants";
import Rabbit from './model/characters/rabbit';
import Wolf from './model/characters/wolf';
import Hunter from './model/characters/hunter';

const field = new Field();
// const objects = new Array(30).fill(0).map(() => new GameObject(Math.random() * FIELD_WIDTH, Math.random() * FIELD_HEIGHT, Behaviour.FLOCK));

const rabbits = new Array(10).fill(0).map(() => new Rabbit(Math.random() * FIELD_WIDTH, Math.random() * FIELD_HEIGHT))
const wolves = new Array(10).fill(0).map(() => new Wolf(Math.random() * FIELD_WIDTH, Math.random() * FIELD_HEIGHT))
const hunter = new Hunter(Math.random() * FIELD_WIDTH, Math.random() * FIELD_HEIGHT)
const objects = [...rabbits, ...wolves];

const gameObject = new GameObject(500, 350);
const mouse = new Vector(0, 0);
const canvas = document.getElementById('canvas')

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
})

field.createCanvas();

const updateFrame = () => {
    const characters = [...objects, hunter].filter(char => !char.isDead)
    objects.forEach((object) => {
        object.simulateCurrentBehaviour(characters);
    })
    if (!hunter.isDead) {
        hunter.simulateCurrentBehaviour(mouse)
    }
    field.drawField(characters)

    requestAnimationFrame(updateFrame)
}

updateFrame();

// setInterval(updateFrame, 1000 / 30)
