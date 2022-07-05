import { Notation, State } from "../quoridor/State";


export function getRandomMove(state: State): Notation {
    const moves = [...state.children.keys()];
    return moves[Math.random() * moves.length];
}

export const RandomAgent = {
    isMachine: true,
    name: 'RandomAgent',
    getMove: getRandomMove,
};
