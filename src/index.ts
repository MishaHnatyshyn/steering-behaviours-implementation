import Field from "./view/Field";
import {
    DEFAULT_DEERS_AMOUNT,
    DEFAULT_RABBITS_AMOUNT,
    DEFAULT_WOLVES_AMOUNT,
} from "./constants";
import Game from "./model/game";

const form = document.getElementById('form') as HTMLFormElement;
const rabbitsAmount: HTMLInputElement = document.getElementById('rabbits') as HTMLInputElement;
const deersAmount = document.getElementById('deers') as HTMLInputElement;
const wolvesAmount = document.getElementById('wolves') as HTMLInputElement;

const setDefaultAmountOfAnimals = () => {
    rabbitsAmount.value = String(DEFAULT_RABBITS_AMOUNT);
    wolvesAmount.value = String(DEFAULT_WOLVES_AMOUNT);
    deersAmount.value = String(DEFAULT_DEERS_AMOUNT);
}

const field = new Field();
field.createCanvas();
setDefaultAmountOfAnimals();
const game = new Game(field);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.target[3].blur();
    game.startGame(Number(rabbitsAmount.value), Number(wolvesAmount.value))
})
