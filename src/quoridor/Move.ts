import { Pos } from "./State";

export enum Orientation {
    Vertical='v',
    Horizontal='h',
}

export type PawnMove = {
    target: Pos,
}

export type WallMove = {
    square: Pos
    orientation: Orientation,
}

export type Move = WallMove | PawnMove;
