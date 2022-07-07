import { Move, Orientation } from "./Move";
import { Pos } from "./State";

export type Notation = string;

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function isPawnMove(notation: Notation): boolean {
    return !(notation.endsWith(Orientation.Vertical) || notation.endsWith(Orientation.Horizontal));
}

export function posToString(pos: Pos): string {
    if (pos[0] < 0 || pos[0] >= ALPHABET.length)
        throw new Error("Board is to large to be represented by standard notation");
    return ALPHABET[Math.floor(pos[0] / 2)] + Math.ceil(pos[1] / 2);
}
// maybe check validity with a regex
export function notationToMove(notation: string): Move {
    const row = ALPHABET.indexOf(notation[0]);
    if (notation.endsWith(Orientation.Vertical) || notation.endsWith(Orientation.Horizontal)) {
        const orientation = notation.endsWith(Orientation.Vertical) ? Orientation.Vertical : Orientation.Horizontal;
        const column = Number.parseInt(notation.substring(1, notation.length - 1));
        return {
            square: [2 * row - 1, column * 2 - 1],
            orientation
        }
    } else {
        const column = Number.parseInt(notation.substring(1, notation.length));
        return {
            target: [2 * row - 1, column * 2 - 1],
        }
    }
}

export function moveToNotation({ move }: { move: Move; }): string {
    if ('target' in move) {
        return posToString(move.target);
    } else {
        const or = move.orientation === Orientation.Vertical ? 'v' : 'h';
        return posToString(move.square) + or;
    }
}
