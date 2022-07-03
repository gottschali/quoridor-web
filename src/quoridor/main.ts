import { Game } from "./Game";
import { RandomAgent } from "../agents/RandomAgent";


const game = new Game(RandomAgent, RandomAgent, {boardHeight: 3, boardWidth: 3, walls: 3});
console.log("Starting Game")
game.gameLoop();
console.log("Stopping Game")

export {};
