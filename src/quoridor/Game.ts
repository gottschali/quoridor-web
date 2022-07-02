import type { Agent } from "./Agent";
import type { Move } from "./Move";
import { State, type GameSettings } from "./State";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export class Game {
    state: State;
    history: Array<Move>;
    turn = 0;
    whiteAgent: Agent;
    blackAgent: Agent;

    constructor(whiteAgent: Agent, blackAgent: Agent, settings?: GameSettings) {
        this.whiteAgent = whiteAgent;
        this.blackAgent = blackAgent;
        this.state = new State(settings || {});
        this.history = [];

    }

    step() {
        const currentAgent = this.turn % 2 == 0 ? this.whiteAgent : this.blackAgent;
        console.log(`Turn ${this.turn}`);
        let selectedMove = currentAgent.selectMove(this.state.legalMoves);
        while (!this.state.isLegal(selectedMove)) {
            selectedMove = currentAgent.selectMove(this.state.legalMoves);
        }
        console.log(`Move: ${JSON.stringify(selectedMove)}`);
        this.state.makeMove(selectedMove);
        console.log(this.state.toString());
        this.turn++;
    }

    async gameLoop() {
        console.log(this.state.toString());
        while (!this.state.isGameOver()) {
            this.step();
            // await sleep(500);
        }
        console.log("Game Over!");
    }
}
