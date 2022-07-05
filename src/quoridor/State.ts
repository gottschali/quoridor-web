/*
 * Think about abstracting to a more general game
 * - n walls per player
 * - k pawns per player
 * So far only 2 are supported
 * pawnPositions[0] for white and ...[1] for black
 * - arbitrary board size
 * - But I would restrict it to a 2-player game
 */

import { Orientation, type Move, type PawnMove, type WallMove } from "./Move";
import { Coord } from "./Coord";
import { Player } from "./Player";
import deepEqual from 'deep-equal';

export interface GameSettings {
    boardWidth?: number,
    boardHeight?:  number,
    walls?: number,
    pawns?: number,
}

type MandatoryGameSettings = {
    boardWidth: number,
    boardHeight:  number,
    walls: number,
    pawns: number,
}

const GameSettingsDefaults: MandatoryGameSettings = {
    boardWidth: 9,
    boardHeight:  9,
    walls: 10,
    pawns: 1,
}

type Pos = number[];
type Board = Array<Array<boolean>>;
type Dists = Array<Array<number>>;


// TODO need to still convert between different formats
const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function isPawnMove(notation: Notation): boolean {
    return !(notation.endsWith('v') || notation.endsWith('h'));
}

export function coordToString(coord: Coord): string {
    if (coord.row < 0 || coord.row >= ALPHABET.length)
        throw new Error("Board is to large to be represented by standard notation");
    return ALPHABET[Math.floor(coord.row / 2)] + Math.ceil(coord.column / 2);
}
// maybe check validity with a regex
export function notationToMove(notation: string): Move {
    const row = ALPHABET.indexOf(notation[0]);
    if (notation.endsWith('v') || notation.endsWith('h')) {
        const orientation = notation.endsWith('v') ? Orientation.Vertical : Orientation.Horizontal;
        const column = Number.parseInt(notation.substring(1, notation.length - 1));
        return {
            square: new Coord(2 * row - 1, column * 2 - 1),
            orientation
        }
    } else {
        const column = Number.parseInt(notation.substring(1, notation.length));
        return {
            target: new Coord(2 * row - 1, column * 2 - 1),
        }
    }
}

export function moveToNotation(move: Move): string {
    if ('target' in move) {
        return coordToString(move.target);
    } else {
        const or = move.orientation === Orientation.Vertical ? 'v' : 'h';
        return coordToString(move.square) + or;
    }
}
export type Notation = string;

/*
 * The wall logic is heavily flawed atm
 * We define wallPositions as the 2d array
 * But the player can only be between this grid
 *
 * Use 1-based external coordinates
 * convert to internal bigger representation
 */

export class State {
    // We can index these variables with currentPlayer
    pawnPositions: Array<Coord>;
    wallsAvailable: Array<number>;
    // There could be made an argument that we could store which player the wall belongs to
    // But for the game and the sake of simplicity it is not important
    board: Board;
    dists1: Dists;
    dists2: Dists;
    settings: MandatoryGameSettings;
    currentPlayer: Player;
    width: number;
    height: number;
    illegal = false;
    shortestPaths : number[];
    private precomputedMoves: Set<Notation> | undefined;
    private _children: Map<Notation, State> | undefined;

    constructor(settings: GameSettings = GameSettingsDefaults) {
        this.settings = { ...GameSettingsDefaults, ...settings };
        this.wallsAvailable = [this.settings.walls, this.settings.walls];
        // The size of the internal matrix representation
        this.width = this.settings.boardWidth * 2 + 1;
        this.height = this.settings.boardHeight * 2 + 1;
        this.shortestPaths = [this.settings.boardHeight, this.settings.boardHeight];
        const middle = Math.ceil(this.settings.boardWidth / 2);
        this.pawnPositions = [
            new Coord(1, middle).convertToInternal(),
            new Coord(this.settings.boardHeight, middle).convertToInternal(),
        ];
        this.board = new Array(this.height)
            .fill(0)
            .map(() => new Array(this.width).fill(false));

        this.dists1 = new Array(this.height)
            .fill(0)
            .map(() => new Array(this.width).fill(-1));

        this.dists2 = new Array(this.height)
            .fill(0)
            .map(() => new Array(this.width).fill(-1));

        // Hack: surround the board with walls that we do not have to do bounds checking
        for (let i=0;i<this.height;i++) {
            this.board[i][0] = true;
            this.board[i][this.width - 1] = true;
        }
        for (let j=0;j<this.width;j++) {
            this.board[0][j] = true;
            this.board[this.height - 1][j] = true;
        }
        // White begins
        this.currentPlayer = Player.white;
    }



    isLegal(move: Move | Notation): boolean {
        // If we generate all legal moves anyways we can just check if the move is in that list
        // But in some cases it may be better for performance if we have a separate check here
        // Need the deepEqual because wallMove is a nested object
        // return this.legalMoves.some( (l) =>  deepEqual(move, l));
        if (typeof move === 'string') {
            return this.legalMoves.has(move);
        } else {
            return this.legalMoves.has(moveToNotation(move));
        }
    }

    winner(): Player | null {
        // Check if a pawn is on the finish line.
        // A draw is not possible?! Is it actually?
        // Not sure: if you can jump over the finish line
        if (this.pawnPositions[Player.white].row >= this.height - 2) {
            return Player.white;
        } else if (this.pawnPositions[Player.black].row <= 1) {
            return Player.black;
        }
        return null;
    }

    isGameOver(): boolean {
        return this.winner() !== null;
    }
    placeWall(move: WallMove, board: Board): void {
        const {row, column} = move.square;
        // We invert the bits that we can place the same wall
        // again to revert the operation
        if (move.orientation === Orientation.Horizontal) {
            board[row][column] = true;
            board[row][column + 1] = true; // For UI
            board[row][column + 2] = true;
        } else {
            board[row][column] = true;
            board[row + 1][column] = true;  // Just for UI
            board[row + 2][column] = true;
        }
    }

    makeMove(move: Move|Notation): State {
        // We expect moves to use the internal representations
        // try to make it immutable and return
        // a new State instead of modifying this one?
        if (typeof move === 'string') {
            if (this.legalMoves.has(move)) {
                const res = this.children.get(move);
                if (res) return res;
            }
            move = notationToMove(move);
        }

        // if (!this.isLegal(move)) {
        //     throw new Error('Illegal move given')
        // }


        const newState = new State(this.settings);


        for (let i=0;i<this.height;i++) {
            for (let j=0;j<this.width;j++) {
                newState.board[i][j] = this.board[i][j];
                // newState.dists1[i][j] = this.dists1[i][j];
                // newState.dists2[i][j] = this.dists2[i][j];
            }
        }
        newState.pawnPositions = [...this.pawnPositions];
        newState.wallsAvailable = [...this.wallsAvailable];
        // newState.shortestPaths = [...this.shortestPaths];

        // I would like have a type guard here like move typeof PawnMove
        // But the type information is not available at runtime...
        // That's why we have to use this ugly in operator narrowing

        newState.currentPlayer = this.currentPlayer === Player.white ? Player.black : Player.white;

        if ('target' in move) {
            // move typeof PawnMove
            newState.pawnPositions[this.currentPlayer] = move.target;
        } else {
            // move typeof WallMove
            newState.placeWall(move, newState.board);
            newState.wallsAvailable[this.currentPlayer]--;

        }

        let reachable = true;
        // recreate distField if necessary
        try {
            const d = newState.BFS(newState.pawnPositions[newState.opponent], newState.opponent, newState.dists1)
            newState.shortestPaths[newState.opponent] = d;
        } catch (err) {
            reachable = false;
        }
        try {
            const d = newState.BFS(newState.pawnPositions[newState.currentPlayer], newState.currentPlayer, newState.dists2);
            newState.shortestPaths[newState.currentPlayer] = d;
        } catch (err) {
            reachable = false;
        }
        if (!reachable) {
            newState.illegal = true;
        }
        return newState;
    }

    generateManhattanMoves(pos: Coord, board: Board): Array<Coord> {
        const wallBlocks = pos.neighbours(1).map(({row, column}) => board[row][column]);
        const targets = pos.neighbours(2);

        return targets.filter((c, i) => !wallBlocks[i]);
    }

    generatePawnMoves(pawnPos: Coord): Array<Move> {
        // All adjacent squares
        // But have to be on the board
        let simpleMoves = this.generateManhattanMoves(pawnPos, this.board);
        const enemyPos = this.pawnPositions[this.opponent];
        simpleMoves.forEach(c => {
            if (c.equals(enemyPos)) {
                // Jumps are possible!
                const direction = (enemyPos.sub(pawnPos)).mul(1/2);
                const behind = enemyPos.add(direction);
                // But there may be a wall behind him
                if (!this.board[behind.row][behind.column]) {
                    simpleMoves.push(behind.add(direction));
                } else {
                    for (c of this.generateManhattanMoves(enemyPos, this.board)) {
                        simpleMoves.push(c);
                    }
                }
            }
        });
        return simpleMoves.filter(p => !p.equals(pawnPos))
            .filter(p => !p.equals(enemyPos))
            .map(c => {
                return {
                    target: c,
                }
            });
    }
    finishLine(pos: Pos, player: Player): boolean {
        if (player === Player.white) {
            return pos[0] >= this.height - 2;
        } else {
            return pos[0] <= 1;
        }
    }

    get opponent(): Player {
        return this.currentPlayer === Player.white ? Player.black : Player.white;
    }

    BFS(start: Coord, player: Player, dists: Dists) {
        const q: number[][] = [[start.row, start.column]];
        dists[start.row][start.column] = 0;
        while (q.length > 0) {
            const v = q.shift();
            if (!v) continue;
            const [row, col] = v;
            if (this.finishLine(v, player)) {
                return dists[row][col];
            }

            const ns = [
                [row + 2, col],
                [row, col + 2],
                [row, col - 2],
                [row - 2, col],
            ];

            const ws = [
                this.board[row + 1][col],
                this.board[row][col + 1],
                this.board[row][col - 1],
                this.board[row - 1][col],
            ];

            ns.forEach(([y, x], i) => {
                if (!ws[i] && dists[y][x] === -1) {
                    dists[y][x] = dists[row][col] + 1;
                    q.push([y, x]);
                }
            })
        }
        throw new Error('Caging invariant violated: a pawn should always be able to reach the finish line');
    }

    generateWallMoves(): Array<Move> {
        // Iterate over board row by row
        // Check if a wall could be placed either vertically or horizontally
        // Problem: crossing walls
        const moves: Array<Move> = [];
        if (this.wallsAvailable[this.currentPlayer] === 0) {
            return moves;
        }
        // We will run a number of checks that will filter out candidates
        // 1. The wall may not overlap with other walls
        // 2. It may not cross another wall
        // 3. The enemy pawn must still be able to win

        // Vertical walls
        for (let i=1;i<this.height-2; i+=2) {
            for (let j=2;j<this.width - 2; j+=2) {
                if (this.board[i][j]) continue;
                if (this.board[i + 2][j]) continue;
                if (this.board[i + 1][j - 1] && this.board[i + 1][j + 1]) continue;
                const move = {
                    square: new Coord(i, j),
                    orientation: Orientation.Vertical,
                };
                // if (!this.checkNotCaged(move)) continue;
                moves.push(move);
            }
        }
        // Horizontal walls
        for (let i=0;i<this.height; i+=2) {
            for (let j=1;j<this.width - 2; j+=2) {
                if (this.board[i][j]) continue;
                if (this.board[i][j + 2]) continue;
                if (this.board[i - 1][j + 1] && this.board[i + 1][j + 1]) continue;
                const move = {
                        square: new Coord(i, j),
                        orientation: Orientation.Horizontal,
                    }
                // if (!this.checkNotCaged(move)) continue;
                moves.push(move);
            }
        }
        return moves;
    }

    generateLegalMoves(): Array<Move> {
        let moves: Array<Move> = [];
        if (!this.isGameOver()) {
            // 1. Generate all possible pawn moves
            moves = this.generatePawnMoves(this.pawnPositions[this.currentPlayer]);
            // 2. Generate all possible wall placements
            moves = moves.concat(this.generateWallMoves());
        }
        return moves;
    }

    computeChildren(): Map<Notation, State> {
        const m = new Map<Notation, State>();
        this.precomputedMoves = new Set<Notation>();
        // for all Moves (not necessarily legal)
        const moves = this.generateLegalMoves(); // not so legal any more
        for (const move of moves) {
            const notation: Notation = moveToNotation(move);
            const newState = this.makeMove(move);
            if (!newState.illegal) {
                this.precomputedMoves.add(notation);
                m.set(notation, newState);
            }
        }
        return m;
    }

    get children(): Map<string, State> {
        if (this._children === undefined) {
            this._children = this.computeChildren();
        }
        return this._children;
    }

    get legalMoves(): Set<Notation> {
        if (!this.precomputedMoves) {
            this.precomputedMoves = new Set<Notation>();
            this.computeChildren();
        }
        return this.precomputedMoves;
    }

    toString(): string {
        // ASCII art less go
        let res = "";
        for (let i=1;i<this.height-1; i++) {
            for (let j=1;j<this.width-1; j++) {
                if (i % 2 == 0 && j % 2 == 0) {
                    if (this.board[i][j]) {
                        res += "■";
                    } else {
                        res += "+";
                    }
                } else if (i % 2 !== j % 2) {
                    if (this.board[i][j]) {
                        res += "■";
                    } else {
                        res += " ";
                    }
                } else if (i % 2 == 1 && j % 2 == 1) {
                    const c = new Coord(i, j);
                    if (this.pawnPositions[Player.white].equals(c)) {
                        res += "○";
                    } else if (this.pawnPositions[Player.black].equals(c)) {
                        res += "●";
                    } else {
                        res += ".";
                    }
                }
            }
            res += "\n";
        }
        return res;
    }

    playOutWithoutWalls() {
        // In progress
        // try to do an automatic play out without walls
        // It is not that trivial
        // I think we need two run two BFS at the "same" time
        // But we are not sure which way the opponent goes...
        // let posWhite = [-1, -1];
        // let tWhite = Number.POSITIVE_INFINITY;
        // let posBlack = [-1, -1];
        // let tBlack = Number.POSITIVE_INFINITY;
        // const dWhite = this.currentPlayer === Player.white ? this.dists2 : this.dists1;
        // const dBlack = this.currentPlayer === Player.black ? this.dists2 : this.dists1;
        // for (let i=1;i<this.width;i+=2) {
        //     if (dWhite[this.height-2][i] < tWhite) {
        //         tWhite = dWhite[this.height-2][i];
        //         posWhite = [this.height-2, i];
        //     }
        //     if (dBlack[1][i] < tBlack) {
        //         tBlack = dBlack[1][i];
        //         posBlack = [1, i];
        //     }
        // }
        // let pawnWhite = [this.pawnPositions[0].row, this.pawnPositions[0].column];
        // let pawnBlack = [this.pawnPositions[1].row, this.pawnPositions[1].column];
        // let whitePath = [];
        // while (! (posWhite[0] == pawnWhite[0] && posWhite[1] == pawnWhite[1])) {
        //     const [i, j] = posWhite;
        //     const d = dWhite[i][j];
        //     if (d ==)
        //     if (d)
        // }
        // const dists = new Array(this.height)
        //     .fill(0)
        //     .map(() => new Array(this.width).fill(-1));

        // // for (let i=0;i<this.height;i++) {
        // //     for (let j=0;j<this.width; j++) {
        // //         if (this.board[i][j]) {
        // //             dists[i][j] = -2;
        // //         }
        // //     }
        // // }
        // let {row: i, column: j} = this.pawnPositions[Player.white]
        // const qWhite: number[][] = [[i, j]];
        // dists[i][j] = 0;
        // let {row: y, column: x} = this.pawnPositions[Player.black]
        // const qBlack: number[][] = [[y, x]];
        // dists[y][x] = 0;

        // let turn = this.currentPlayer;
        // while (qWhite.length > 0 && qBlack.length > 0) {
        //     // Take turns
        //     const q = turn === Player.white ? qWhite : qBlack;

        //     let  v = q.shift();
        //     if (!v) continue;
        //     const [row, col] = v;
        //     if (this.finishLine(new Coord(row, col), turn)) {
        //         return turn;
        //     }

        //     const ns = [
        //         [row + 2, col],
        //         [row, col + 2],
        //         [row, col - 2],
        //         [row - 2, col],
        //     ];

        //     for (const [y, x] of ns) {
        //         if (this.board[y][x]) continue; // Wallblock
        //         if (dists[y][x] !== -1) continue; // Visited
        //         if (dists[y][x] === dists[row][col]) {
        //             // possibly a jump
        //         }
        //         dists[y][x] = dists[row][col] + 1;
        //         q.push([y, x]);
        //     }

        //     turn = turn === Player.white ? Player.black : Player.white;

        // }
        // throw new Error('Should never happen. Otherwise a pawn could not reach the finishline');
    }
}
