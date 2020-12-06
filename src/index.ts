// import './styles/main.scss'
import Field from "./view/Field";
import GameObject from "./model/gameObject";
import Vector from "./model/vector";
import {Behaviour} from "./model/behaviour.enum";
import {FIELD_HEIGHT, FIELD_WIDTH} from "./constants";

const field = new Field();
const objects = new Array(30).fill(0).map(() => new GameObject(Math.random() * FIELD_WIDTH, Math.random() * FIELD_HEIGHT, Behaviour.FLOCK))
const gameObject = new GameObject(500, 350);
const mouse = new Vector(0, 0);
const canvas = document.getElementById('canvas')

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
})

field.createCanvas();

const updateFrame = () => {
    objects.forEach((object) => {
        object.simulateCurrentBehaviour(objects);
    })
    // gameObject.wander()
    // gameObject.update();
    // field.drawField([gameObject])
    field.drawField(objects)

    requestAnimationFrame(updateFrame)
}

updateFrame();

// setInterval(updateFrame, 1000 / 30)