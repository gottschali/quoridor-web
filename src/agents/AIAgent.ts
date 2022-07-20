import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";
import { MachineAgent } from "./Agent";
import { MCTSNode } from "./MCTSNode";
import { shortestPathMove } from "./ShortestPathAgent";
import { iterativeDeepening } from "./iterativeDeepening";
import Company from "./Company";

export function AIAgent(): MachineAgent {


    async function getMove(state: State): Promise<Notation> {
        if (state.wallsAvailable[state.currentPlayer] === 0) {
            return shortestPathMove(state);
        } else if (state.wallsAvailable[state.opponent] === 0) {
            return shortestPathMove(state);
        } else if (state.turn < state.height / 4) {
            return shortestPathMove(state);
        } else {
            console.log("YEET", state.legalMoves.size);
            const minmaxMove = iterativeDeepening(state, 100, Company.workers);
            // const root = new MCTSNode(state, null, "ROOT", state.currentPlayer);
            // const mctsMove = root.bestAction(1000);
            return minmaxMove;
        }
    }

    return {
        isMachine: true,
        name: 'AIAgent',
        getMove: getMove,
    }
}
