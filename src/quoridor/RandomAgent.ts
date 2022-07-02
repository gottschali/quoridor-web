import type { Move } from "./Move";

export class RandomAgent {

    selectMove(moves: Array<Move>) {
        return moves[Math.floor(Math.random() * moves.length)];
    }
}
