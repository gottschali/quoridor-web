import { State } from "../quoridor/State";
import { getMove, MachineAgent } from "./Agent";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/*
 * Try to make a Wrapper around quick agents to add a delay
 * But this does not yet work because I have to have the function async
 * Then a Promise<Move> is returned instead of a move and I would need to add
 * extra cases or change everything to async?
 */

export function SleepyAgent(agent: MachineAgent, timeout=500) {
    return {
        isMachine: true,
        name: 'Sleepy' + agent.name,
        getMove: async (state: State) => {
            await sleep(timeout);
            return agent.getMove(state);
        }
    }
}
