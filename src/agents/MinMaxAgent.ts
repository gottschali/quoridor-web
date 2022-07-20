import { State } from "../quoridor/State";
import { MachineAgent } from "./Agent";
import { minMaxWrapper } from "./minMax";
import { shortestPathMove } from "./ShortestPathAgent";

export function MinMaxAgent(depth=2): MachineAgent {

    function getMove(state: State) {
        if (state.wallsAvailable[state.currentPlayer] === 0) {
            return shortestPathMove(state);
        } else {
            return minMaxWrapper(state, depth);
        }
    }

    return {
        isMachine: true,
        name: 'MinMaxAgent',
        getMove: getMove,
    }
}
