import type { Agent, MachineAgent } from "../agents/Agent";
import type { Move } from "./Move";
import { State, type GameSettings } from "./State";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export class Game {
    state: State;
    history: Array<Move>;
    turn = 0;
    whiteAgent: MachineAgent;
    blackAgent: MachineAgent;

    constructor(whiteAgent: MachineAgent, blackAgent: MachineAgent, settings?: GameSettings) {
        this.whiteAgent = whiteAgent;
        this.blackAgent = blackAgent;
        this.state = new State(settings || {});
        this.history = [];

    }

    step() {
        const currentAgent = this.turn % 2 == 0 ? this.whiteAgent : this.blackAgent;
        console.log(`Turn ${this.turn}`);
        let selectedMove = currentAgent.getMove(this.state);
        while (!this.state.isLegal(selectedMove)) {
            selectedMove = currentAgent.getMove(this.state);
        }
        console.log(`Move: ${JSON.stringify(selectedMove)}`);
        this.state = this.state.makeMove(selectedMove);
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
