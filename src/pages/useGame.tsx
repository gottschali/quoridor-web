import { useEffect, useState } from "react";
import { Move, PawnMove } from "../quoridor/Move";
import { Player } from "../quoridor/Player";
import { State } from "../quoridor/State";

function selectMove(moves: Array<Move>) {
    return moves[Math.floor(Math.random() * moves.length)];
}

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

export function useGame() {
    const [state, setState] = useState(new State({}));
    const [turn, setIndex] = useState(0);
    const [history, setHistory] = useState<Move[]>([]);
    const [stateHistory, setStateHistory] = useState<State[]>([]);

    const [matrix, setMatrix] = useState<MatrixItem[][]>(new Array(state.height).fill(0)
                                            .map( () => new Array(state.width).fill(MatrixItem.Uninitialized)));

    useEffect(() => {
        const newMatrix = new Array(state.height).fill(0).map( () => new Array(state.width).fill(0))

        for (let i=0;i<state.height; i++) {
            for (let j=0;j<state.width; j++) {
                if (i == 0 || i == state.height -1 || j == 0 || j == state.width - 1) {
                    newMatrix[i][j] = MatrixItem.Uninitialized;
                } else if (i % 2 == 0 && j % 2 == 0) {
                    newMatrix[i][j] = MatrixItem.Cross;
                } else  if (i % 2 != j % 2) {
                    newMatrix[i][j] = state.board[i][j] ? MatrixItem.PlacedWall : MatrixItem.UnplacedWall;
                } else {
                    newMatrix[i][j] = MatrixItem.EmptySquare;
                }
            }
        }
        // The order is important here because it overwrites EmptySquares
        state.legalMoves.filter(l => 'target' in l)
                        .map(l => (l as PawnMove).target)
                        .forEach(p => {
                            console.log(p)
                            newMatrix[p.row][p.column] = MatrixItem.PawnTarget;
                        });
        {
            let {row, column} = state.pawnPositions[Player.white];
            newMatrix[row][column] = MatrixItem.WhitePawn;
        }
        {
            let {row, column} = state.pawnPositions[Player.black];
            newMatrix[row][column] = MatrixItem.BlackPawn;
        }

        setMatrix(newMatrix);

    }, [turn, state])

    const apply = (move: Move) => {
        state.makeMove(move)
        setState(state);
        setIndex(turn + 1);
    }

    const proposeMove = (move: Move) => {
        console.debug(`Proposed move: ${JSON.stringify(move)}`);
        if (!state.isLegal(move)) {
            console.debug(`Move is illaegal`);
        } else {
            console.debug(`Move: ${JSON.stringify(move)}`);
            history.push(move);
            setHistory(history);
            stateHistory.push(state);
            setStateHistory(stateHistory);
            setState(state.makeMove(move));
            setIndex(turn + 1);
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
            setIndex(index);
        } catch {
           console.error("State history index out of range")
        }
    }

    const step = () => {
        let selectedMove = selectMove(state.legalMoves);
        console.debug(`Selected move: ${JSON.stringify(selectedMove)}`);
        proposeMove(selectedMove);
    }

    return {apply, state, restoreHistory, turn, step, proposeMove, matrix, history}
}
