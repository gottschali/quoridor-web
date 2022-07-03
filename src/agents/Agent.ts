import { Move } from "../quoridor/Move";
import { State } from "../quoridor/State";

export type getMove = (state: State) => Move;

export class HumanAgent implements Agent {
    isMachine=false;
    name='Human Agent'
}


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
