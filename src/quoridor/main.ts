import { Game } from "./Game";
import { RandomAgent } from "../agents/RandomAgent";
import { MinMaxAgent } from "../agents/MinMaxAgent";


const game = new Game(RandomAgent, RandomAgent, {boardHeight: 9, boardWidth: 9, walls: 5});
console.log("Starting Game")
game.gameLoop();
console.log(`Game over after ${game.turn}`);
console.log(`The winner is ${game.state.winner()}`);

export {};
