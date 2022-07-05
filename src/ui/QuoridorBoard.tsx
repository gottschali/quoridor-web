import { Dispatch, useEffect, useState } from "react"
import { Agent } from "../agents/Agent";
import { Coord } from "../quoridor/Coord";
import { Move, Orientation, WallMove } from "../quoridor/Move";
import { Player } from "../quoridor/Player";
import { coordToString, moveToNotation, Notation, State } from "../quoridor/State";
import './Game.css';
import { MatrixItem, } from "./useGame";

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
 * - We highligh some walls that are impossible to place...
 */


interface WallProps {
    occupied: boolean, row: number, column: number, orientation: Orientation,
    proposeMove?: any,
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
        proposeMove(moveToNotation(move));
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

interface Props {
    controlled: boolean,
    game: {matrix: MatrixItem[][], state: State, turn: number},
    submitMove: (move: Notation) => void,
    agent: Agent,
}

export function QuoridorBoard({controlled, game, submitMove, agent}: Props) {
    // const {state, restoreHistory, turn, step, proposeMove, matrix, history} = game;
    const {state, matrix} = game;
    // We use sentinel impossible values here
    const [wall0, setWall0] = useState<Coord>(new Coord(-1, -1));
    const [wall1, setWall1] = useState<Coord>(new Coord(-1, -1));
    const [thinking, setThinking] = useState<boolean>(false);

    const think = async () => {
        if (agent.getMove && !state.isGameOver()) {
            console.log("Automatically getting move")
            setThinking(true);
            await new Promise(r => setTimeout(r, 50));
            submitMove(agent.getMove(state));
            setThinking(true);
        }
    }

    useEffect(() => {
        think();
    }, [game.turn, agent]);

    const proposeProxy = (c: Coord) => {
        submitMove(coordToString(c))
    }

    return (
        <div>
            <table className='gameInfo'>
                {/* <button onClick={() => step()}> {turn} </button> */}
                <tbody>
                    <tr>
                        <td> Current agent </td>
                        <td> {agent.name} {thinking && ' thinking...'}</td>
                    </tr>
                    <tr>
                        <td> Game State </td>
                        <td> {state.isGameOver() ? state.winner() : 'ongoing'}</td>
                    </tr>
                    <tr>
                        <td> white walls </td>
                        <td> {state.wallsAvailable[0]} </td>
                    </tr>
                    <tr>
                        <td> black walls </td>
                        <td> {state.wallsAvailable[1]} </td>
                    </tr>
                </tbody>
            </table>
            <div className='board'>
                <table className='gameTable' cellSpacing={0}>
                    <tbody>
                    {matrix.map((row, i) => (
                        <tr key={i}>
                            {row.map((item: MatrixItem, j) => {
                                const c = new Coord(i, j);
                                if (item === MatrixItem.Uninitialized) {
                                    return <td key={j} />
                                } else if (item === MatrixItem.Cross) {
                                    return <td key={j} className='cross'/>
                                } else if (item === MatrixItem.PlacedWall || item === MatrixItem.UnplacedWall) {
                                    return <Wall row={i}
                                                column={j}
                                                highlight={wall0.equals(c) || wall1.equals(c)}
                                                key={j}
                                                occupied={item === MatrixItem.PlacedWall}
                                                orientation={i % 2 == 0 ? Orientation.Horizontal : Orientation.Vertical}
                                                 proposeMove={controlled ? submitMove : ()=>{}}
                                                setWall0={setWall0}
                                                setWall1={setWall1} />
                                } else if (item === MatrixItem.BlackPawn) {
                                    return <Pawn key={j} player={Player.black} />;
                                } else if (item === MatrixItem.WhitePawn) {
                                    return <Pawn key={j} player={Player.white} />;
                                } else if (item === MatrixItem.EmptySquare || item === MatrixItem.PawnTarget) {
                                    return <Square key={j}
                                                    highlight={controlled && item === MatrixItem.PawnTarget}
                                                    row={i}
                                                    column={j}
                                                    proposeProx={proposeProxy} />
                                }
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* <MoveHistory history={history} restoreHistory={restoreHistory} /> */}
        </div>
    )
}
