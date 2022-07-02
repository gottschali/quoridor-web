import type { Move } from "./Move";

export type Agent = {
    selectMove: (moves: Array<Move>) => Move,
};
