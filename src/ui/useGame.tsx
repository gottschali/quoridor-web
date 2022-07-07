import { useEffect, useState } from "react";
import { Move, PawnMove } from "../quoridor/Move";
import { Notation } from "../quoridor/Notation";
import { Player } from "../quoridor/Player";
import { GameSettings, MandatoryGameSettings, State } from "../quoridor/State";

export enum MatrixItem {
    PawnTarget,
    WhitePawn,
    BlackPawn,
    PlacedWall,
    UnplacedWall,
    Cross,
    EmptySquare,
    Uninitialized,
}

export function useGame(settings: GameSettings) {
    const [state, setState] = useState(new State(settings));
    const [turn, setTurn] = useState(0);
    const [history, setHistory] = useState<Notation[]>([]);
    const [stateHistory, setStateHistory] = useState<State[]>([]);

    const [matrix, setMatrix] = useState<MatrixItem[][]>(new Array(state.height).fill(0)
                                            .map( () => new Array(state.width).fill(MatrixItem.Uninitialized)));

    useEffect(() => {
        console.log(state.settings);
        const newMatrix = new Array(state.height).fill(0).map( () => new Array(state.width).fill(0))

        for (let i=0;i<state.height; i++) {
            for (let j=0;j<state.width; j++) {
                if (i === 0 || i === state.height -1 || j === 0 || j === state.width - 1) {
                    newMatrix[i][j] = MatrixItem.Uninitialized;
                } else if (i % 2 === 0 && j % 2 === 0) {
                    if (state.board[i-1][j] === 1 || state.board[i+1][j] === 1 || state.board[i][j+1] === 1 || state.board[i][j-1] === 1) {
                        newMatrix[i][j] = MatrixItem.PlacedWall;
                    } else {
                        newMatrix[i][j] = MatrixItem.Cross;
                    }
                } else  if (i % 2 != j % 2) {
                    newMatrix[i][j] = state.board[i][j] === 1 ? MatrixItem.PlacedWall : MatrixItem.UnplacedWall;
                } else {
                    newMatrix[i][j] = MatrixItem.EmptySquare;
                }
            }
        }
        // The order is important here because it overwrites EmptySquares
        state.generatePawnMoves(state.pawnPositions[state.currentPlayer])
                        .map(l => (l as PawnMove).target)
                        .forEach(([i, j]) => {
                            newMatrix[i][j] = MatrixItem.PawnTarget;
                        });
        let [ row, column ] = state.pawnPositions[Player.white];
        newMatrix[row][column] = MatrixItem.WhitePawn;
        let [ y, x ] = state.pawnPositions[Player.black];
        newMatrix[y][x] = MatrixItem.BlackPawn;
        setMatrix(newMatrix);

    }, [turn, state])

    const reset = (settings: MandatoryGameSettings) => {
        setState(new State(settings))
        setHistory([]);
        setTurn(0);
        setMatrix(new Array(settings.boardHeight * 2 + 1).fill(0).map( () => new Array(settings.boardWidth * 2 + 1).fill(0)));
    }

    const apply = (move: Move) => {
        state.makeMove(move)
        setState(state);
        setTurn(turn + 1);
    }

    const proposeMove = (move: Notation) => {
        console.debug(`Proposed move: ${move}`);
        if (!state.isLegal(move)) {
            console.debug(`Move is illegal`);
            return false;
        } else {
            history.push(move);
            setHistory(history);
            stateHistory.push(state);
            setStateHistory(stateHistory);
            setState(state.makeMove(move));
            setTurn(turn + 1);
            return true;
        }
    }

    const restoreHistory = (index: number) => {
        /**
         * WARNING: does only load a past state.
         * But we should either only allow time travel without making moves
         * or otherwise delete the "future" history becuase otherwise there will a messy tree
         */
        try {
            setState(stateHistory[index]);
            setTurn(index);
            history.splice(index + 1, history.length-index);
            setHistory(history);
        } catch {
           console.error("State history index out of range")
        }
    }

    return {apply, state, restoreHistory, turn, proposeMove, matrix, history, reset}
}
