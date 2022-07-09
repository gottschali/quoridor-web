import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Agent } from "../agents/Agent";
import { HumanAgent } from "../agents/HumanAgent";
import { Notation } from "../quoridor/Notation";
import { Player } from "../quoridor/Player";
import { GameSettings, GameSettingsDefaults, MandatoryGameSettings } from "../quoridor/State";
import { GameActions } from "./GameActions";
import { GameInformation } from "./GameInformation";
import { GameOverDialog } from "./GameOverDialog";
import { Agents, GameSetup } from "./GameSetup";
import { MoveHistory } from "./MoveHistory";
import { QuoridorBoard } from "./QuoridorBoard";
import { Rules } from "./Rules";
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

    const think = async () => {
        if (currentAgent.getMove && !game.state.isGameOver()) {
            console.log("Automatically getting move")
            await new Promise(r => setTimeout(r, 200));
            const move = await currentAgent.getMove(game.state)
            submitMove(move);
        }
    }

    useEffect(() => {
        think();
    }, [game.turn]);

    const createGame = (whiteAgent: Agent, blackAgent: Agent, settings: MandatoryGameSettings) => {
        console.log('Creating game', settings);
        setGameOverDialogOpen(true);
        setBlackAgent(blackAgent);
        setWhiteAgent(whiteAgent);
        setSettings(settings);
        game.reset(settings);
        // TODO: Actually reset the game!
        setCreating(false);
        setShowSettings(false);
    }

    return (<div>
                <Stack>
                    <GameInformation currentAgent={currentAgent} game={game} />
                    <GameActions setShowSettings={setShowSettings}
                                 reset={()=>game.reset(game.state.settings)}
                                 undo={()=>game.restoreHistory(game.turn-1)}
                                 showRules={()=>setShowRules(true)}
                    />
                </Stack>
                <Box w="100%" p={5} className='board-container' bg="orange.200">
                    <QuoridorBoard controlled={controlled}
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
