import { State } from "../quoridor/State";
import { MachineAgent } from "./Agent";
import { minMaxWrapper } from "./minMax";
import { shortestPathMove } from "./ShortestPathAgent";
import Company from "./Company";

export let nodes = 0;

export function MinMaxAgent(depth=2): MachineAgent {

    function getMove(state: State) {
        if (state.wallsAvailable[state.currentPlayer] === 0) {
            return shortestPathMove(state);
        } else {
            return minMaxWrapper(state, depth, Company.workers)
        }
    }

    return {
        isMachine: true,
        name: `MinMax(${depth})`,
        getMove: getMove,
    }
}
