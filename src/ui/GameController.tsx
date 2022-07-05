import { Switch } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Agent } from "../agents/Agent";
import { HumanAgent } from "../agents/HumanAgent";
import { Move } from "../quoridor/Move";
import { Player } from "../quoridor/Player";
import { Notation } from "../quoridor/State";
import { Agents, GameSetup } from "./GameSetup";
import { QuoridorBoard } from "./QuoridorBoard";
import { useGame } from "./useGame";

export type localTeam = Player | 'gray' | 'observer';

/**
 *
   Not really nice
   maybe just have a game Settings state here
   (this should also include the different agens)
   Then pass this to the settings components
   This settings components should be a able to trigger a reset
   Then new settings are loaded and a new game is created

   Similary we should have a controls component which can
   reset, undo, pause, ...
 */

export function GameController() {
    const game = useGame();
    // const {state, restoreHistory, turn, step, proposeMove, matrix, history} = useGame();
    const [whiteAgent, setWhiteAgent] = useState<Agent>(HumanAgent);
    const [currentAgent, setCurrentAgent] = useState<Agent>(whiteAgent);
    const [blackAgent, setBlackAgent] = useState<Agent>(HumanAgent);
    const [localTeam, setLocalTeam] = useState<localTeam>('gray');
    const [showSettings, setShowSettings] = useState<boolean>(true);

    useEffect(() => {
            setCurrentAgent(game.state.currentPlayer === Player.white ? blackAgent : whiteAgent);
    }, [whiteAgent, blackAgent]);


    const [creating, setCreating] = useState(true);

    const controlled = localTeam === 'gray' || localTeam === game.state.currentPlayer;

    const submitMove = (move: Notation) => {
        console.log(`Move was submitted: ${JSON.stringify(move)}`);
        const temp = game.state.currentPlayer;
        if (game.proposeMove(move)) {
            setCurrentAgent(temp === Player.white ? blackAgent : whiteAgent);
        }
    }

    const createGame = () => {
        console.log('Creating game');
        // TODO: Actually reset the game!
        setCreating(false);
        setShowSettings(false);
    }

    return <div>
            {showSettings &&
            <GameSetup whiteAgent={whiteAgent.name} setWhiteAgent={setWhiteAgent}
                       blackAgent={blackAgent.name} setBlackAgent={setBlackAgent}
                       creating={creating} setCreating={setCreating}
                       createGame={createGame}
            /> }
            {!creating &&
             <div>
             <Switch checked={showSettings} onChange={()=>setShowSettings(!showSettings)} />
             <QuoridorBoard  controlled={controlled}
                            agent={currentAgent}
                            game={game}
                            submitMove={submitMove} />
             </div>}

        </div>
}
