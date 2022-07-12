import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Agent } from "../agents/Agent";
import { HumanAgent } from "../agents/HumanAgent";
import { Notation } from "../quoridor/Notation";
import { Player } from "../quoridor/Player";
import {  GameSettingsDefaults, MandatoryGameSettings } from "../quoridor/State";
import { GameActions } from "./GameActions";
import { GameInformation } from "./GameInformation";
import { GameOverDialog } from "./GameOverDialog";
import { GameSetup } from "./GameSetup";
import { MoveHistory } from "./MoveHistory";
import { QuoridorBoard } from "./QuoridorBoard";
import { Rules } from "./Rules";
import { useGame } from "./useGame";

export type localTeam = Player | 'gray' | 'observer';

export function GameController() {
    // const {state, restoreHistory, turn, step, proposeMove, matrix, history} = useGame();
    const [whiteAgent, setWhiteAgent] = useState<Agent>(HumanAgent);
    const [currentAgent, setCurrentAgent] = useState<Agent>(whiteAgent);
    const [blackAgent, setBlackAgent] = useState<Agent>(HumanAgent);
    const [localTeam, setLocalTeam] = useState<localTeam>('gray');
    const [showSettings, setShowSettings] = useState<boolean>(true);
    const [settings, setSettings] = useState<MandatoryGameSettings>(GameSettingsDefaults);
    const game = useGame(settings);
    const [gameOverDialogOpen, setGameOverDialogOpen] = useState<boolean>(true);
    const [showRules, setShowRules] = useState(false);

    const submitMove = (move: Notation) => {
        console.log(`Move was submitted: ${JSON.stringify(move)}`);
        const temp = game.state.currentPlayer;
        if (game.proposeMove(move)) {
            setCurrentAgent(temp === Player.white ? blackAgent : whiteAgent);
        }
    }

    const think = async (agent?: Agent) => {
        agent = agent !== undefined ? agent : currentAgent;
        console.log("think", agent, game.state.isGameOver());
        if (agent.getMove && !game.state.isGameOver()) {
            console.log("think2")
            await new Promise(r => setTimeout(r, 200));
            console.log(game.state, await agent.getMove(game.state));
            const move = await agent.getMove(game.state)
            console.log("yeetus", move);
            submitMove(move);
        } else {
            console.log("thinkOUT", agent, game.state.isGameOver());
        }
    }

    useEffect(() => {
        think();
    }, [game.turn]);

    const createGame = (whiteAgent: Agent, blackAgent: Agent, settings: MandatoryGameSettings) => {
        if (currentAgent.terminate) {
            currentAgent.terminate();
        }
        setBlackAgent(blackAgent);
        setWhiteAgent(whiteAgent);
        setSettings(settings);
        setGameOverDialogOpen(true);
        setShowSettings(false);
        game.reset(settings);
        setCurrentAgent(whiteAgent);
        think(whiteAgent);
    }

    const reset = () => {
        if (currentAgent.terminate) {
            currentAgent.terminate();
        }
        setGameOverDialogOpen(true);
        setShowSettings(false);
        game.reset(settings);
        setCurrentAgent(whiteAgent);
        setTimeout(()=> {
            think(whiteAgent);
        }, 200);
    }

    return (<div>
                <Stack>
                    <GameInformation currentAgent={currentAgent} game={game} />
                    <GameActions setShowSettings={setShowSettings}
                                 reset={reset}
                                 undo={()=>game.restoreHistory(game.turn-1)}
                                 showRules={()=>setShowRules(true)}
                    />
                </Stack>
                <Box w="100%" p={5} className='board-container' bg="orange.200">
                    <QuoridorBoard controlled={!currentAgent.isMachine}
                                   game={game}
                                   submitMove={submitMove} />
                </Box>
                {/*                 <MoveHistory history={game.history} restoreHistory={game.restoreHistory} /> */}
            <GameSetup open={showSettings}
                       close={()=>setShowSettings(false)}
                       submitSettings={createGame} />

            <GameOverDialog reset={() => game.reset(GameSettingsDefaults)}
                            open={gameOverDialogOpen && game.state.isGameOver()}
                        close={() => setGameOverDialogOpen(false)} />
            <Rules open={showRules} close={()=>setShowRules(false)} />
    </div>
    )
}
