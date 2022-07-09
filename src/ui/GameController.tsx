import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Badge, Box, Button, CircularProgress, Flex, Spacer, Stack, Switch } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Agent } from "../agents/Agent";
import { HumanAgent } from "../agents/HumanAgent";
import { Notation } from "../quoridor/Notation";
import { Player } from "../quoridor/Player";
import { GameSettings, GameSettingsDefaults, MandatoryGameSettings } from "../quoridor/State";
import { Agents, GameSetup } from "./GameSetup";
import { MoveHistory } from "./MoveHistory";
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
    // const {state, restoreHistory, turn, step, proposeMove, matrix, history} = useGame();
    const [whiteAgent, setWhiteAgent] = useState<Agent>(HumanAgent);
    const [currentAgent, setCurrentAgent] = useState<Agent>(whiteAgent);
    const [blackAgent, setBlackAgent] = useState<Agent>(HumanAgent);
    const [localTeam, setLocalTeam] = useState<localTeam>('gray');
    const [showSettings, setShowSettings] = useState<boolean>(true);
    const [settings, setSettings] = useState<MandatoryGameSettings>(GameSettingsDefaults);
    const game = useGame(settings);
    const cancelRef = useRef<HTMLElement>(null);
    const [gameOverDialogOpen, setGameOverDialogOpen] = useState<boolean>(true);


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

    const [thinking, setThinking] = useState<boolean>(false);

    const think = async () => {
        if (currentAgent.getMove && !game.state.isGameOver()) {
            console.log("Automatically getting move")
            setThinking(true);
            await new Promise(r => setTimeout(r, 200));
            const move = await currentAgent.getMove(game.state)
            submitMove(move);
            setThinking(true);
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

    return <div>
            {showSettings &&
            <GameSetup creating={creating} setCreating={setCreating}
                       submitSettings={createGame}
            /> }
            {!creating &&
             <div>
             <Switch checked={!showSettings} onChange={()=>setShowSettings(!showSettings)} />
                <Box w="100%" p={5} className='board-container' bg="orange.200">
                    <Stack direction='row'>
                        <Badge>
                            {currentAgent.name} {thinking && <CircularProgress isIndeterminate color='green.300' />}
                        </Badge>
                        {game.state.isGameOver()
                        ? <Badge> Winner: {game.state.winner() === Player.white ? "○" : "●" }</Badge>
                         : <Badge> undecided </Badge>
                        }
                        <Badge>turn: {game.turn} </Badge>
                        <Badge>walls ○ : {game.state.wallsAvailable[Player.white]} </Badge>
                        <Badge>walls ●: {game.state.wallsAvailable[Player.black]} </Badge>
                    </Stack>

                    <QuoridorBoard  controlled={controlled}
                                    agent={currentAgent}
                                    game={game}
                                    submitMove={submitMove} />
             </Box>
                {/*                 <MoveHistory history={game.history} restoreHistory={game.restoreHistory} /> */}
             </div>}
            <AlertDialog
                    motionPreset='slideInBottom'
                    leastDestructiveRef={cancelRef}
                    onClose={()=>game.reset(GameSettingsDefaults)}
                    isOpen={gameOverDialogOpen && game.state.isGameOver()}
                    isCentered
                >
                    <AlertDialogOverlay />

                    <AlertDialogContent>
                    <AlertDialogHeader>The game has ended</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        A player has reached the opposite side of the board.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onClick={()=>setGameOverDialogOpen(false)}>
                        Back to the board
                        </Button>
                        <Button onClick={()=>game.reset(settings)} colorScheme='red' ml={3}>
                        Reset
                        </Button>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
        </div>
}
