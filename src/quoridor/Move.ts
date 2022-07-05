import type { Coord } from "./Coord";

export enum Orientation {
    Vertical='v',
    Horizontal='h',
}

export type PawnMove = {
    target: Coord,
}

export type WallMove = {
    square: Coord,
    orientation: Orientation,
}

export type Move = WallMove | PawnMove;
