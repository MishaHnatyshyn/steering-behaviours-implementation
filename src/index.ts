// import './styles/main.scss'
import Field from "./view/Field";
import GameObject from "./model/gameObject";
import Vector from "./model/vector";

const field = new Field();
const gameObject = new GameObject(500, 350);
const mouse = new Vector(0, 0);
const canvas = document.getElementById('canvas')

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
})

field.createCanvas();

const updateFrame = () => {
    gameObject.arrive(mouse)
    gameObject.update();
    field.drawField([gameObject])
}

setInterval(updateFrame, 1000 / 60)