import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";
import { MachineAgent } from "./Agent";
import Company from "./Company";
import { shortestPathMove } from "./ShortestPathAgent";
import { workTypes } from "./Worker";


export function MCTSAgent(simulations=4_000): MachineAgent {


    async function MCTSWrapper(state: State, simulations: number): Promise<Notation> {
        const worker = Company.workers[0];
        return new Promise(resolve => {
            const stateNotation = state.toNotation();
            worker.postMessage([workTypes.MCTS, stateNotation, state.settings, simulations]);
            worker.onmessage = function (e: MessageEvent) {
                const [bestMove] = e.data;
                resolve(bestMove);
            }
        })
    }

    function getMove(state: State) {
        if (state.wallsAvailable[state.currentPlayer] === 0) {
            return shortestPathMove(state);
        } else {
            return MCTSWrapper(state, simulations);
        }
    }

    return {
        isMachine: true,
        name: `MCTS(${Math.round(simulations/1000)}k)`,
        getMove,
    }
}
