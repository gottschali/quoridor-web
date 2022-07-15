import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";
import { MachineAgent } from "./Agent";
import { MCTSNode } from "./MCTSNode";
import { shortestPathMove } from "./ShortestPathAgent";
 // eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./MinMaxWorker";
import { iterativeDeepening } from "./iterativeDeepening";

let workers = new Array(navigator.hardwareConcurrency || 4).fill(null)
    .map(()=> new Worker());

export function AIAgent(): MachineAgent {


    async function getMove(state: State): Promise<Notation> {
        if (state.wallsAvailable[state.currentPlayer] === 0) {
            return shortestPathMove(state);
        } else if (state.wallsAvailable[state.opponent] === 0) {
            return shortestPathMove(state);
        } else if (state.turn < state.height / 4) {
            return shortestPathMove(state);
        } else {
            const minmaxMove = iterativeDeepening(state, 200, workers);
            // const root = new MCTSNode(state, null, "ROOT", state.currentPlayer);
            // const mctsMove = root.bestAction(1000);
            return minmaxMove;
        }
    }

    function terminate() {
        for (const worker of workers) {
            worker.terminate();
        }
        workers = new Array(navigator.hardwareConcurrency || 4).fill(null)
            .map(()=> new Worker());
    }

    return {
        isMachine: true,
        name: 'AIAgent',
        getMove: getMove,
        terminate: terminate,
    }
}
