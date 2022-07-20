import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Agent } from "../agents/Agent";
import Company from "../agents/Company";
import { HumanAgent } from "../agents/HumanAgent";
import { shortestPathMove } from "../agents/ShortestPathAgent";
import { Notation } from "../quoridor/Notation";
import { Player } from "../quoridor/Player";
import {  GameSettingsDefaults, MandatoryGameSettings } from "../quoridor/State";
import { GameActions } from "./GameActions";
import { GameInformation } from "./GameInformation";
import { GameOverDialog } from "./GameOverDialog";
import { GameSetup } from "./GameSetup";
import { MoveHistory } from "./MoveHistory";
import { PlayOutDialog } from "./PlayOutDialog";
import { QuoridorBoard } from "./QuoridorBoard";
import { Rules } from "./Rules";
import { useGame } from "./useGame";

export type localTeam = Player | 'gray' | 'observer';

export function GameController() {
    // const {state, restoreHistory, turn, step, proposeMove, matrix, history} = useGame();
    const [whiteAgent, setWhiteAgent] = useState<Agent>(HumanAgent);
    const [currentAgent, setCurrentAgent] = useState<Agent>(whiteAgent);
    const [blackAgent, setBlackAgent] = useState<Agent>(HumanAgent);
    const [showSettings, setShowSettings] = useState<boolean>(true);
    const [settings, setSettings] = useState<MandatoryGameSettings>(GameSettingsDefaults);
    const game = useGame(settings);
    const [gameOverDialogOpen, setGameOverDialogOpen] = useState<boolean>(true);
    const [autoPlayDialogOpen, setAutoPlayDialogOpen] = useState<boolean>(true);
    const [autoMove, setAutoMove] = useState(false);

    const [showRules, setShowRules] = useState(false);

    const submitMove = (move: Notation) => {
        console.log(`Move was submitted: ${JSON.stringify(move)}`);
        const temp = game.state.currentPlayer;
        if (game.proposeMove(move)) {
            setCurrentAgent(temp === Player.white ? blackAgent : whiteAgent);
        }
    }

    const think = async (agent?: Agent) => {
        console.log(`${agent && agent.name} thinking...`)
        agent = agent !== undefined ? agent : currentAgent;
        if (agent.getMove && !game.state.isGameOver()) {
            await new Promise(r => setTimeout(r, 200));
            const move = await agent.getMove(game.state)
            submitMove(move);
        }
    }

    useEffect(() => {
        game.state.automaticPlayout();
        if (!game.state.isGameOver()) {
            if (autoMove) {
                makeAutoMove();
            } else {
                think();
            }
        } else {
            setAutoMove(false);
        }
    }, [game.turn]);

    const createGame = (whiteAgent: Agent, blackAgent: Agent, settings: MandatoryGameSettings) => {
        Company.terminate();
        setBlackAgent(blackAgent);
        setWhiteAgent(whiteAgent);
        setSettings(settings);
        setGameOverDialogOpen(true);
        setShowSettings(false);
        game.reset(settings);
        setCurrentAgent(whiteAgent);
        setTimeout(() => {
            think(whiteAgent);
        }, 1000);
    }

    const reset = () => {
        Company.terminate();
        setGameOverDialogOpen(true);
        setAutoPlayDialogOpen(true);
        setShowSettings(false);
        setAutoMove(false);
        setCurrentAgent(whiteAgent);
        game.reset(settings);
        setTimeout(() => {
            think(whiteAgent);
        }, 1000);
    }

    const makeAutoMove = async () => {
        await new Promise(r => setTimeout(r, 200));
        const move = await shortestPathMove(game.state);
        submitMove(move);
    }


    const autoPlayout = async () => {
        setAutoPlayDialogOpen(false);
        setAutoMove(true);
        makeAutoMove();
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

            <GameOverDialog reset={reset}
                            open={gameOverDialogOpen && game.state.isGameOver()}
                            winner={game.state.winner()}
                    close={() => setGameOverDialogOpen(false)} />
            <PlayOutDialog
                open={!currentAgent.isMachine && autoPlayDialogOpen && game.state.automaticPlayoutPossible}
                playout={autoPlayout}
                close={() => setAutoPlayDialogOpen(false)}
            />
            <Rules open={showRules} close={()=>setShowRules(false)} />
    </div>
    )
}
