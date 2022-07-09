import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";

export type getMove = (state: State) => Promise<Notation>;


export interface Agent {
    isMachine: boolean,
    name: string,
    getMove?: getMove,
}

export interface HumanAgent extends MachineAgent {
    getmove?: getMove,
}

export interface MachineAgent {
    isMachine: boolean,
    name: string,
    getMove: getMove,
}
