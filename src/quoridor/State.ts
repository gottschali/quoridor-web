/*
 * Think about abstracting to a more general game
 * - k pawns per player
 * So far only 2 are supported
 * pawnPositions[0] for white and ...[1] for black
 * - arbitrary board size
 * - But I would restrict it to a 2-player game
 */

import { Orientation, type Move, type WallMove } from "./Move";
import { moveToNotation, Notation, notationToMove } from "./Notation";
import { Player } from "./Player";

export interface GameSettings {
    boardWidth?: number,
    boardHeight?:  number,
    walls?: number,
    pawns?: number,
}

export type MandatoryGameSettings = {
    boardWidth: number,
    boardHeight:  number,
    walls: number,
    pawns: number,
}

export const GameSettingsDefaults: MandatoryGameSettings = {
    boardWidth: 9,
    boardHeight:  9,
    walls: 10,
    pawns: 1,
}

export type Pos = number[];
export type Board = Int8Array[];

export class State {
    // We can index these variables with currentPlayer
    pawnPositions: Array<Pos>;
    wallsAvailable: Array<number>;
    // There could be made an argument that we could store which player the wall belongs to
    // But for the game and the sake of simplicity it is not important
    board: Board;
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
            [1, middle * 2 - 1],
            [this.height - 2, middle * 2 - 1],
        ];
        this.board = new Array(this.height)
            .fill(0)
            .map(() => new Int8Array(this.width).fill(-1));

        // Hack: surround the board with walls that we do not have to do bounds checking
        for (let i=0;i<this.height;i++) {
            this.board[i][0] = 1;
            this.board[i][this.width - 1] = 1;
        }
        for (let j=0;j<this.width;j++) {
            this.board[0][j] = 1;
            this.board[this.height - 1][j] = 1;
        }
        // White begins
        this.currentPlayer = Player.white;
    }



    isLegal(move: Move | Notation): boolean {
        // If we generate all legal moves anyways we can just check if the move is in that list
        // But in some cases it may be better for performance if we have a separate check here
        // Need the deepEqual because wallMove is a nested object
        if (typeof move === 'string') {
            return this.legalMoves.has(move);
        } else {
            return this.legalMoves.has(moveToNotation({ move }));
        }
    }

    winner(): Player | null {
        // Check if a pawn is on the finish line.
        // Not sure: what happens if you would jump over finish line
        if (this.pawnPositions[Player.white][0] >= this.height - 2) {
            return Player.white;
        } else if (this.pawnPositions[Player.black][0] <= 1) {
            return Player.black;
        }
        return null;
    }

    isGameOver(): boolean {
        return this.winner() !== null;
    }

    placeWall(move: WallMove, board: Board): void {
        const [ row, column ] = move.square;
        if (move.orientation === Orientation.Horizontal) {
            board[row][column] = 1;
            board[row][column + 2] = 1;
        } else {
            board[row][column] = 1;
            board[row + 2][column] = 1;
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
        const newState = new State(this.settings);

        for (let i=0;i<this.height;i++) {
            for (let j=0;j<this.width;j++) {
                newState.board[i][j] = this.board[i][j];
                if (i % 2 == 0 && j % 2 == 0) { // crosses
                    newState.board[i][j] = -1;
                }
                if (i % 2 == 1 && j % 2 == 1) { // crosses
                    newState.board[i][j] = -1;
                }
            }
        }
        newState.pawnPositions = [...this.pawnPositions];
        newState.wallsAvailable = [...this.wallsAvailable];
        newState.currentPlayer = this.currentPlayer === Player.white ? Player.black : Player.white;

        // I would like have a type guard here like move typeof PawnMove
        // But the type information is not available at runtime...
        // That's why we have to use this ugly in operator narrowing
        if ('target' in move) {
            newState.pawnPositions[this.currentPlayer] = move.target;
        } else {
            newState.placeWall(move, newState.board);
            newState.wallsAvailable[this.currentPlayer]--;
        }
        // recreate distField if necessary
        // TODO: check if we can skip recomputing
        const d1 = newState.whiteBFS(newState.pawnPositions[Player.white]);
        if (d1 === -1) newState.illegal = true;
        newState.shortestPaths[Player.white] = d1;
        const d = newState.blackBFS(newState.pawnPositions[Player.black]);
        if (d === -1) newState.illegal = true;
        newState.shortestPaths[Player.black] = d;
        return newState;
    }

    generateManhattanMoves(pos: Pos, board: Board): Array<Pos> {
        const [row, col] = pos;
        const ns = [
            [row + 2, col],
            [row, col + 2],
            [row, col - 2],
            [row - 2, col],
        ];
        const ws = [
            board[row + 1][col],
            board[row][col + 1],
            board[row][col - 1],
            board[row - 1][col],
        ];
        return ns.filter((_, i) => ws[i] != 1);
    }

    generatePawnMoves(pawnPos: Pos): Array<Move> {
        // All adjacent squares
        const res: Move[] = [];
        const enemyPos = this.pawnPositions[this.opponent];
        this.generateManhattanMoves(pawnPos, this.board).forEach(c => {
            if (c[0] === enemyPos[0] && c[1] === enemyPos[1]) {
                // Jumps are possible!
                const direction = [(enemyPos[0] - pawnPos[0])/2, (enemyPos[1] - pawnPos[1])/2];
                const behind = [enemyPos[0] + direction[0], enemyPos[1] + direction[1]];
                // But there may be a wall behind him
                if (this.board[behind[0]][behind[1]] !== 1) {
                    res.push({
                            target: [behind[0] + direction[0], behind[1] + direction[1]]
                        })
                } else {
                    for (c of this.generateManhattanMoves(enemyPos, this.board)) {
                        if (enemyPos[0] !== pawnPos[0] || enemyPos[1] !== pawnPos[1]) {
                            res.push({
                                target: c
                            })
                        }
                    }
                }
            } else {
                res.push({
                    target: c
                });
            }
        });
        return res;
    }

    get opponent(): Player {
        return this.currentPlayer === Player.white ? Player.black : Player.white;
    }

    whiteBFS(start: Pos): number {
        const q: number[][] = [start];
        this.board[start[0]][start[1]] = 0;
        while (q.length > 0) {
            const v = q.shift();
            if (!v) continue;
            const [row, col] = v;
            if (row >= this.height - 2) {
                return this.board[row][col];
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
                if (ws[i] !== 1 && this.board[y][x] === -1) {
                    this.board[y][x] = this.board[row][col] + 1;
                    q.push([y, x]);
                }
            })
        }
        return -1;
    }

    blackBFS(start: Pos) {
        // Shift everything by -1, -1 when storing or accessing dists
        // This way we can use the empty spaces between walls to store this in the board matrix
        const q: number[][] = [start];
        this.board[start[0] - 1][start[1] - 1] = 0;
        while (q.length > 0) {
            const v = q.shift();
            if (!v) continue;
            const [row, col] = v;
            if (row <= 1) {
                return this.board[row-1][col-1];
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
                if (ws[i] !== 1 && this.board[y - 1][x - 1] === -1) {
                    this.board[y-1][x-1] = this.board[row-1][col-1] + 1;
                    q.push([y, x]);
                }
            })
        }
        return -1;
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
        // 3. The enemy pawn must still be able to win (this will be checked only later)

        // Vertical walls
        for (let i=1;i<this.height-2; i+=2) {
            for (let j=2;j<this.width - 2; j+=2) {
                if (this.board[i][j] === 1) continue;
                if (this.board[i + 2][j] === 1) continue;
                if (this.board[i + 1][j - 1] === 1 && this.board[i + 1][j + 1] === 1) continue;
                const move = {
                    square: [i, j],
                    orientation: Orientation.Vertical,
                };
                moves.push(move);
            }
        }
        // Horizontal walls
        for (let i=0;i<this.height; i+=2) {
            for (let j=1;j<this.width - 2; j+=2) {
                if (this.board[i][j] === 1) continue;
                if (this.board[i][j + 2] === 1) continue;
                if (this.board[i - 1][j + 1] === 1 && this.board[i + 1][j + 1] === 1) continue;
                const move = {
                        square: [i, j],
                        orientation: Orientation.Horizontal,
                    }
                moves.push(move);
            }
        }
        return moves;
    }

    generateAllMoves(): Array<Move> {
        let moves: Array<Move> = [];
        if (!this.isGameOver()) {
            moves = this.generatePawnMoves(this.pawnPositions[this.currentPlayer]);
            moves = moves.concat(this.generateWallMoves());
        }
        return moves;
    }

    computeChildren(): Map<Notation, State> {
        const m = new Map<Notation, State>();
        this.precomputedMoves = new Set<Notation>();
        // for all Moves (not necessarily legal)
        const moves = this.generateAllMoves(); // not so legal any more
        for (const move of moves) {
            const notation: Notation = moveToNotation({ move });
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
                if (i % 2 === 0 && j % 2 === 0) {
                    if (this.board[i][j] === 1) {
                        res += "■";
                    } else {
                        res += "+";
                    }
                } else if (i % 2 !== j % 2) {
                    if (this.board[i][j] === 1) {
                        res += "■";
                    } else {
                        res += " ";
                    }
                } else if (i % 2 === 1 && j % 2 === 1) {
                    if (this.pawnPositions[Player.white][0] === i && this.pawnPositions[Player.white][1] === j) {
                        res += "○";
                    } else if (this.pawnPositions[Player.black][0] === i && this.pawnPositions[Player.black][1] === j) {
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
}
