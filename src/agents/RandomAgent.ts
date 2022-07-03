import { State } from "../quoridor/State";


export function getRandomMove(state: State) {
    return state.legalMoves[Math.floor(Math.random() * state.legalMoves.length)];
}

export const RandomAgent = {
    isMachine: true,
    name: 'RandomAgent',
    getMove: getRandomMove,
};
