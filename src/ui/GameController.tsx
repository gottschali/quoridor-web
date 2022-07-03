import { useState } from "react";
import { Agent } from "../agents/Agent";
import { Move } from "../quoridor/Move";
import { Player } from "../quoridor/Player";
import { QuoridorBoard } from "./QuoridorBoard";
import { useGame } from "./useGame";

export type localTeam = Player | 'gray' | 'observer';

export function GameController(whitePlayer: Agent, blackPlayer: Agent, localTeam: localTeam) {
    const [currentAgent, setCurrentAgent] = useState(whitePlayer);
    const game = useGame();
    // const {state, restoreHistory, turn, step, proposeMove, matrix, history} = useGame();

    const controlled = localTeam === 'gray' || localTeam === game.state.currentPlayer;

    const submitMove = (move: Move) => {
        console.log(`Move was submitted: ${JSON.stringify(move)}`);
        const temp = game.state.currentPlayer;
        if (game.proposeMove(move)) {
            setCurrentAgent(temp === Player.white ? blackPlayer : whitePlayer);
        }
    }

    return <QuoridorBoard  controlled={controlled}
                            agent={currentAgent}
                            game={game}
                            submitMove={submitMove} />
}
