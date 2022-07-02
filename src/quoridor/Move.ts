import type { Coord } from "./Coord";

export enum Orientation {
    Vertical=0,
    Horizontal=1,
}

export type PawnMove = {
    source: Coord,
    target: Coord,
}

export type WallMove = {
    square: Coord,
    orientation: Orientation,
}

export type Move = WallMove | PawnMove;
