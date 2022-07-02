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
    board: Array<Array<boolean>>;
    settings: MandatoryGameSettings;
    currentPlayer: Player;
    width: number;
    height: number;
    private precomputedMoves: Array<Move> | undefined;

    constructor(settings: GameSettings = GameSettingsDefaults) {
        this.settings = { ...GameSettingsDefaults, ...settings };
        this.wallsAvailable = [this.settings.walls, this.settings.walls];
        // The size of the internal matrix representation
        this.width = this.settings.boardWidth * 2 + 1;
        this.height = this.settings.boardHeight * 2 + 1;
        const middle = Math.ceil(this.settings.boardWidth / 2);
        this.pawnPositions = [
            new Coord(1, middle).convertToInternal(),
            new Coord(this.settings.boardHeight, middle).convertToInternal(),
        ];
        this.board = new Array(this.height)
            .fill(false)
            .map(() => new Array(this.width).fill(false));
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

    isLegal(move: Move): boolean {
        // If we generate all legal moves anyways we can just check if the move is in that list
        // But in some cases it may be better for performance if we have a separate check here
        // Need the deepEqual because wallMove is a nested object
        return this.legalMoves.some( (l) =>  deepEqual(move, l));
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

    placeWall(move: WallMove, board: Array<Array<Boolean>>): void {
        const {row, column} = move.square;
        // We invert the bits that we can place the same wall
        // again to revert the operation
        if (move.orientation === Orientation.Horizontal) {
            board[row][column] = !board[row][column];
            board[row][column + 1] = !board[row][column + 1] // For UI
            board[row][column + 2] = !board[row][column + 2];
        } else {
            board[row][column] = !board[row][column];
            board[row + 1][column] = !board[row + 1][column];  // Just for UI
            board[row + 2][column] = !board[row + 2][column];
        }
    }

    makeMove(move: Move): State {
        // We expect moves to use the internal representations
        // try to make it immutable and return
        // a new State instead of modifying this one?
        if (!this.isLegal(move)) {
            throw new Error('Illegal move given')
        }
        const newState = new State(this.settings);


        for (let i=0;i<this.height;i++) {
            for (let j=0;j<this.width;j++) {
                newState.board[i][j] = this.board[i][j];
            }
        }
        newState.pawnPositions = this.pawnPositions;

        // I would like have a type guard here like move typeof PawnMove
        // But the type information is not available at runtime...
        // That's why we have to use this ugly in operator narrowing

        if ('source' in move) {
            // move typeof PawnMove
            newState.pawnPositions[this.currentPlayer] = move.target;
        } else {
            // move typeof WallMove
            newState.placeWall(move, newState.board);
            newState.wallsAvailable[this.currentPlayer]--;
        }
        newState.currentPlayer = this.currentPlayer === Player.white ? Player.black : Player.white;
        return newState;
    }

    generateManhattanMoves(pos: Coord, board: Array<Array<Boolean>>): Array<Coord> {
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
                    source: pawnPos,
                    target: c,
                }
            });
    }
    finishLine(pos: Coord, player: Player): boolean {
        if (player === Player.white) {
            return pos.row >= this.height - 2;
        } else {
            return pos.row <= 1;
        }
    }

    get opponent(): Player {
        return this.currentPlayer === Player.white ? Player.black : Player.white;
    }

    checkNotCaged(move: WallMove): boolean {
        // do a BFS
        // starting from the enemy pawn
        // return true if both pawns can reach the finishing line

        const r1 = this.BFS(this.currentPlayer, move);
        const r2 = this.BFS(this.opponent, move);
        return r1 && r2;
    }
    BFS(player: Player, move: WallMove): boolean {
        const start = this.pawnPositions[player];
        const visited = new Array(this.height)
            .fill(false)
            .map(() => new Array(this.width).fill(false));
        for (let i=0;i<this.height;i++) {
            for (let j=0;j<this.width; j++) {
                visited[i][j] = this.board[i][j].valueOf();
            }
        }
        this.placeWall(move, visited);
        const q: Array<Coord> = [start];
        while (q.length > 0) {
            const v = q.shift();
            if (!v) continue
            if (this.finishLine(v, player)) {
                return true; // Found a way
            }
            // There may be problem with opponent pawn interactions
            for (const c of this.generateManhattanMoves(v, visited)) {
                if (visited[c.row][c.column]) continue;
                visited[c.row][c.column] = true;
                q.push(c);
            }

        }
        return false;
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
                if (!this.checkNotCaged(move)) continue;
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
                if (!this.checkNotCaged(move)) continue;
                moves.push(move);
            }
        }
        return moves;
    }

    generateLegalMoves(): Array<Move> {
        // 1. Generate all possible pawn moves
        const moves: Array<Move> = this.generatePawnMoves(this.pawnPositions[this.currentPlayer]);
        // 2. Generate all possible wall placements
        return moves.concat(this.generateWallMoves());
    }

    get legalMoves(): Array<Move> {
        if (!this.precomputedMoves) {
            this.precomputedMoves = this.generateLegalMoves();
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
}
