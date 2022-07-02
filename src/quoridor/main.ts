import { Game } from "./Game";
import { RandomAgent } from "./RandomAgent";

const a1 = new RandomAgent();
const a2 = new RandomAgent();

const game = new Game(a1, a2, {boardHeight: 3, boardWidth: 3, walls: 3});
console.log("Starting Game")
game.gameLoop();
console.log("Stopping Game")

export {};
