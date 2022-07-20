import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";
import { selectRandomly } from "./utils";


export async function getRandomMove(state: State): Promise<Notation> {
    const moves = [...state.children.keys()];
    return selectRandomly(moves);
}

export const RandomAgent = {
    isMachine: true,
    name: 'RandomAgent',
    getMove: getRandomMove,
};
