import { Table, TableContainer, Tbody, Thead, Tr, useToast } from "@chakra-ui/react";
import { Dispatch, useEffect, useRef, useState } from "react"
import { Agent } from "../agents/Agent";
import { Move, Orientation, WallMove } from "../quoridor/Move";
import { moveToNotation, Notation, posToString } from "../quoridor/Notation";
import { Player } from "../quoridor/Player";
import { State, Pos } from "../quoridor/State";
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
    placed: boolean, row: number, column: number, orientation: Orientation,
    proposeMove?: any,
    highlight: boolean,
    setWall0: Dispatch<Pos>,
    setWall1: Dispatch<Pos>,
    setWall2: Dispatch<Pos>,
    isLegal: (move: Notation) => boolean,
}

function Wall({placed, row, column, orientation, proposeMove, highlight, setWall0, setWall1, setWall2, isLegal}: WallProps) {
    const handleHover = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top;  //y position within the element.

        let shiftX = 0;
        let shiftY = 0;
        if (orientation === Orientation.Horizontal) {
             shiftX = x <= 25 ? -1 : 1;
        } else {
            shiftY = y <= 25 ? -1 : 1;
        }
        const move: WallMove = {
            square: [row + shiftY, column + shiftX],
            orientation
        }
        if (isLegal(moveToNotation({move}))) {
            setWall0([row, column]);
            setWall2([row + shiftY, column + shiftX]);
            setWall1([row + shiftY * 2, column + shiftX * 2]);
        }
    }
    const handleOut = (e: React.MouseEvent) => {
        setWall0([-1, -1]);
        setWall1([-2, -2]);
        setWall2([-3, -3]);
    }
    const handleClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top;  //y position within the element.

        let shiftX = 0;
        let shiftY = 0;
        if (orientation === Orientation.Horizontal) {
             shiftX = x <= 25 ? -2 : 0;
        } else {
            shiftY = y <= 25 ? -2 : 0;
        }
        const move: WallMove = {
            square: [row + shiftY, column + shiftX],
            orientation
        }
        proposeMove(moveToNotation({ move }));
    }
    let cls = "wall";
    if (placed) {
        cls += " placed";
    } else if (highlight) {
       cls += " highlight";
    } else {
        cls += " free";
    }
    return <td className={cls} onClick={handleClick} onMouseMove={handleHover} onMouseOut={handleOut}/>
}

interface SquareProps {
    row: number,
    column: number,
    highlight: boolean,
    proposeProx: any,
}
function Square({row, column, highlight, proposeProx}: SquareProps) {
    const handleClick = (e: React.MouseEvent) => {
        console.log("Clicked on ", posToString([row, column]));
        if (highlight) proposeProx([row, column]);
    }
    if (highlight) {
        return <td className="square highlight" onClick={handleClick}/>
    } else {
        return <td className="square" onClick={handleClick} />
    }
}

interface Props {
    controlled: boolean,
    game: {matrix: MatrixItem[][], state: State, turn: number},
    submitMove: (move: Notation) => void,
}

function MoveablePawn({player, position}: {player: Player, position: Pos}) {
    // {player === Player.white ?  "○" :  "●"}
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const pos = []
        pos[0] = Math.floor(position[0] / 2) + 1;
        pos[1] = Math.floor(position[1] / 2) + 1;
        if (ref.current) {
            ref.current.style.left = -10 + pos[1] * 50 + 10*(pos[1]-1) + "px";

            ref.current.style.top = -10 + pos[0] * 50 + 10*(pos[0] - 1) + "px";
            if (Player.white === player) {
                ref.current.style.top = 25 + pos[0] * 50 + 10*(pos[0] - 1) + "px";
            } else {
            }
        }
    }, [position]);
    const color = player === Player.white ? 'white' : 'black'
    return <div ref={ref} className={"pawn " + color}>  </div>;
}

export function QuoridorBoard({controlled, game, submitMove }: Props) {
    // const {state, restoreHistory, turn, step, proposeMove, matrix, history} = game;
    const {state, matrix, turn} = game;
    // We use sentinel impossible values here
    const [wall0, setWall0] = useState<Pos>([-1, -1]);
    const [wall1, setWall1] = useState<Pos>([-2, -2]);
    const [wall2, setWall2] = useState<Pos>([-3, -3]);
    const toast = useToast();

    const isMoveLegal = (move: Notation) => {
        if (state.isLegal(move)) return true;
        else {
            toast({
                title: `Invalid move ${move}`,
                description: `This wall either overlaps with existing walls or cuts off the last way for a pawn`,
                status: 'error',
                isClosable: true,
                duration: 4000,
              })
            return false;
        }
    }

    const proposeProxy = (notation: Notation) => {
        if (isMoveLegal(notation)) {
            submitMove(notation);
        }
    }
    return (
            <TableContainer bg="orange.200" className='board'>
                <Table variant='unstyled' display='inline' className='gameTable' cellSpacing={0}>
                    <Thead>
                        <MoveablePawn player={Player.white} position={state.pawnPositions[Player.white]}/>
                        <MoveablePawn player={Player.black} position={state.pawnPositions[Player.black]}/>
                    </Thead>
                    <Tbody>
                    {matrix.map((row, i) => (
                        <Tr key={i}>
                            {row.map((item: MatrixItem, j) => {
                                if (item === MatrixItem.Uninitialized) {
                                    return <td key={j} />
                                } else if (item === MatrixItem.Cross) {
                                    return <Wall row={i}
                                                column={j}
                                                highlight={(wall2[0] === i && wall2[1] === j) || (wall2[0] === i && wall2[1] === j)}
                                                key={j}
                                                placed={false}
                                                orientation={Orientation.Vertical}
                                                isLegal={state.isLegal.bind(state)}
                                                proposeMove={()=>{}}
                                                setWall0={()=>{}}
                                                setWall1={()=>{}}
                                                setWall2={()=>{}}
                                        />
                                } else if (item === MatrixItem.PlacedWall || item === MatrixItem.UnplacedWall) {
                                    return <Wall row={i}
                                                column={j}
                                                highlight={(wall0[0] === i && wall0[1] === j) || (wall1[0] === i && wall1[1] === j)}
                                                key={j}
                                                placed={item === MatrixItem.PlacedWall}
                                                orientation={i % 2 == 0 ? Orientation.Horizontal : Orientation.Vertical}
                                                isLegal={state.isLegal.bind(state)}
                                                proposeMove={controlled ? proposeProxy : ()=>{}}
                                                setWall0={state.wallsAvailable[state.currentPlayer] > 0 ? setWall0 : ()=>{}}
                                                setWall1={state.wallsAvailable[state.currentPlayer] > 0 ? setWall1 : ()=>{}}
                                                setWall2={state.wallsAvailable[state.currentPlayer] > 0 ? setWall2 : ()=>{}}
                                    />
                                } else {
                                    return <Square key={j}
                                                    highlight={controlled && item === MatrixItem.PawnTarget}
                                                    row={i}
                                                    column={j}
                                                   proposeProx={(c: Pos) => proposeProxy(posToString(c))} />
                                }
                            })}
                        </Tr>
                    ))}
                    </Tbody>
                </Table>
            </TableContainer>
    )
}
