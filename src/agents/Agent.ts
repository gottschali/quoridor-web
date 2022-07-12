import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";

export type getMove = (state: State) => Promise<Notation>;


export interface Agent {
    isMachine: boolean,
    name: string,
    getMove?: getMove,
    terminate?: () => void;
}

export interface HumanAgent extends Agent {

}

export interface MachineAgent extends Agent {
    isMachine: boolean,
    name: string,
    getMove: getMove,
}
