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

export function notationToPos(notation: Notation): Pos {
    const row = ALPHABET.indexOf(notation[0]);
    const column = Number.parseInt(notation.substring(1));
    return [2 * row + 1, 2 * column - 1]
}
// maybe check validity with a regex
export function notationToMove(notation: string): Move {
    if (notation.endsWith(Orientation.Vertical) || notation.endsWith(Orientation.Horizontal)) {
        const orientation = notation.endsWith(Orientation.Vertical) ? Orientation.Vertical : Orientation.Horizontal;

        const row = ALPHABET.indexOf(notation[0]);
        const column = Number.parseInt(notation.substring(1, notation.length - 1));
        if (orientation === Orientation.Horizontal) {
            const pos = [2 * row, 2 * column - 1]
            return {
                square: pos,
                orientation
            }
        } else {
            const pos = [2 * row + 1, 2 * column]
            return {
                square: pos,
                orientation
            }
        }
    } else {
        return {
            target: notationToPos(notation),
        }
    }
}

export function moveToNotation({ move }: { move: Move; }): string {
    if ('target' in move) {
        return posToString(move.target);
    } else {
        if (move.orientation === Orientation.Vertical) {
            return posToString(move.square) + 'v';
        } else {
            return posToString(move.square) + 'h';
        }
    }
}
