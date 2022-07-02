import { useEffect, useState } from "react";
import { Move, PawnMove } from "../quoridor/Move";
import { State } from "../quoridor/State";

function selectMove(moves: Array<Move>) {
    return moves[Math.floor(Math.random() * moves.length)];
}

export function useGame() {
    const [state, setState] = useState(new State({}));
    const [turn, setIndex] = useState(0);
    const [history, setHistory] = useState<Move[]>([]);
    const [stateHistory, setStateHistory] = useState<State[]>([]);


    // TODO
    // encode every useful information in here
    // so we do not have to do any silly checks in the UI component
    // and use enums!
    const [matrix, setMatrix] = useState<number[][]>(new Array(state.height).fill(0).map( () => new Array(state.width).fill(0)));

    useEffect(() => {
        const newMatrix = new Array(state.height).fill(0).map( () => new Array(state.width).fill(0))
        console.log(newMatrix);
        state.legalMoves.filter(l => 'target' in l)
                        .map(l => (l as PawnMove).target)
                        .forEach(p => {
                            console.log(p)
                            newMatrix[p.row][p.column] = 1;
                        });
        console.log(newMatrix);
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
