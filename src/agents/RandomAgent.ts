import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";


export async function getRandomMove(state: State): Promise<Notation> {
    const moves = [...state.children.keys()];
    const sel = moves[Math.floor(Math.random() * moves.length)];
    return sel;
}

export const RandomAgent = {
    isMachine: true,
    name: 'RandomAgent',
    getMove: getRandomMove,
};
