import { Dispatch, useState } from "react"
import { Coord } from "../quoridor/Coord";
import { Orientation, WallMove } from "../quoridor/Move";
import { Player } from "../quoridor/Player";
import './Game.css';
import { MoveHistory } from "./MoveHistory";
import { useGame } from "./useGame";

/**
 * Stuff to do
 * - do something at game over
 * - convert Move to Notation
 * - from State to StateNotation
 * - load the Game from StateNotation
 * - show the current player
 *   it is a bit confusing if they stand next to each other
 *   maybe color the square of the active and also add a game info field
 * - undo functionality
 * - selecting different agents
 * - game settings
 */


interface WallProps {
    occupied: boolean, row: number, column: number, orientation: Orientation,
    proposeMove: any,
    highlight: boolean,
    setWall0: Dispatch<Coord>,
    setWall1: Dispatch<Coord>,
}

function Wall({occupied, row, column, orientation, proposeMove, highlight, setWall0, setWall1}: WallProps) {
    const handleHover = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top;  //y position within the element.

        let shiftX = 0;
        let shiftY = 0;
        if (orientation === Orientation.Horizontal) {
             shiftX = x <= 10 ? -2 : 2;
        } else {
            shiftY = y <= 10 ? -2 : 2;
        }
        setWall0(new Coord(row, column));
        setWall1(new Coord(row + shiftY, column + shiftX));
    }
    const handleOut = (e: React.MouseEvent) => {
        setWall0(new Coord(-1, -1));
        setWall1(new Coord(-1, -1));
    }
    const handleClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top;  //y position within the element.

        let shiftX = 0;
        let shiftY = 0;
        if (orientation === Orientation.Horizontal) {
             shiftX = x <= 10 ? -2 : 0;
        } else {
            shiftY = y <= 10 ? -2 : 0;
        }
        const move: WallMove = {
            square: new Coord(row + shiftY, column + shiftX),
            orientation
        }
        proposeMove(move);
    }
    let cls = "wall";
    if (occupied) {
        cls += " placed";
    } else if (highlight) {
       cls += " highlight";
    } else {
        cls += " free";
    }
    return <td className={cls} onClick={handleClick} onMouseMove={handleHover} onMouseOut={handleOut}/>
}
function Pawn({player}: {player: Player}) {
    return <td className="pawn"> {player === Player.white ?  "○" :  "●"} </td>;
}

interface SquareProps {
    row: number,
    column: number,
    highlight: boolean,
    proposeProx: any,
}
function Square({row, column, highlight, proposeProx}: SquareProps) {
    const handleClick = (e: React.MouseEvent) => proposeProx(new Coord(row, column));
    if (highlight) {
        return <td className="square highlight" onClick={handleClick}/>
    } else {
        return <td className="square" />
    }
}

export function DebugPage() {
    const {state, restoreHistory, turn, step, proposeMove, matrix, history} = useGame();
    // We use sentinel impossible values here
    const [wall0, setWall0] = useState<Coord>(new Coord(-1, -1));
    const [wall1, setWall1] = useState<Coord>(new Coord(-1, -1));

    const proposeProxy = (c: Coord) => {
        proposeMove({
            source: state.pawnPositions[state.currentPlayer],
            target: c,
        })
    }

    return (
        <div>
        <div className='gameInfo'>
            <button onClick={() => step()}> {turn} </button>
            <div> Game State: {state.isGameOver() ? state.winner() : 'ongoing'}</div>
            <div> white walls {state.wallsAvailable[0]} </div>
            <div> black walls {state.wallsAvailable[1]} </div>
            <MoveHistory history={history} restoreHistory={restoreHistory} />
        </div>
        <div className='board'>
            <table className='gameTable' cellSpacing={0}>
                <tbody>
                {state.board.map((row, i) => (
                    <tr key={i} style={{}}>
                        {row.map((square, j) => {
                            const c = new Coord(i, j);
                            if (i == 0 || i == state.height -1 || j == 0 || j == state.width - 1) {
                                return <td key={j} />
                            }
                            if (i % 2 == 0 && j % 2 == 0) {
                                return <td key={j} className='cross'/>
                            }
                            if (i % 2 != j % 2) {
                                return <Wall row={i}
                                             column={j}
                                             highlight={wall0.equals(c) || wall1.equals(c)}
                                             key={j}
                                             occupied={square}
                                             orientation={i % 2 == 0 ? Orientation.Horizontal : Orientation.Vertical}
                                             proposeMove={proposeMove}
                                             setWall0={setWall0}
                                             setWall1={setWall1}
                                    />
                            } else {
                                // check for player
                                const c = new Coord(i, j);
                                if (state.pawnPositions[Player.white].equals(c)) {
                                    return <Pawn key={j} player={Player.white} />;
                                } else if (state.pawnPositions[Player.black].equals(c)) {
                                    return <Pawn key={j} player={Player.black} />;
                                } else {
                                    return <Square key={j}
                                                   highlight={matrix[i][j] === 1}
                                                   row={i}
                                                   column={j}
                                                   proposeProx={proposeProxy}/>
                                }
                            }
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
        </div>
    )
}

