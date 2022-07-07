import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";


export function getRandomMove(state: State): Notation {
    const moves = [...state.children.keys()];
    const sel = moves[Math.floor(Math.random() * moves.length)];
    return sel;
}

export const RandomAgent = {
    isMachine: true,
    name: 'RandomAgent',
    getMove: getRandomMove,
};
