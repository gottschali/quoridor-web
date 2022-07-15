import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";
import { MachineAgent } from "./Agent";
import { MCTSNode } from "./MCTSNode";

export function MCTSAgent(): MachineAgent {


    async function MCTSWrapper(state: State, simulations=1000): Promise<Notation> {
        const root = new MCTSNode(state, null, "ROOT", state.currentPlayer);
        return root.bestAction(simulations);
    }

    return {
        isMachine: true,
        name: 'MCTSAgent',
        getMove: MCTSWrapper,
    }
}
