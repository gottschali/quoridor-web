import { Badge, Center, CircularProgress, HStack, Text, Tooltip } from "@chakra-ui/react";
import { type Agent } from "../agents/Agent";
import { Player } from "../quoridor/Player";
import { useGame } from "./useGame";

interface Props {
   currentAgent: Agent;
    game: useGame;
}

export function GameInformation({currentAgent, game}: Props) {
    const winnerIcon = game.state.winner() === Player.white ? "○" : "●";
    const currentIcon = game.state.currentPlayer === Player.white ? "○" : "●";

    return (
            <Center>
                <HStack >
                    {game.state.isGameOver()
                        ? <Badge fontSize='ml' colorScheme={currentAgent.isMachine ? 'green' : 'red'}> Winner: {winnerIcon}</Badge>
                        : <Badge fontSize='ml' variant={game.state.currentPlayer === Player.white ? 'outline' : 'solid'} colorScheme='blackAlpha'> turn: {game.turn} </Badge>
                    }
                    <Tooltip label='How many walls both players have still available'>
                        <Badge fontSize='ml'>
                            walls ●: {game.state.wallsAvailable[Player.black]} ○ : {game.state.wallsAvailable[Player.white]}
                        </Badge>
                    </Tooltip>
                    <Badge fontSize='ml'>Player: {currentAgent.name}
                        {currentIcon}
                    </Badge>
                    <Badge fontSize='ml'>
                        {currentAgent.isMachine && !game.state.isGameOver() && <CircularProgress isIndeterminate size='1em'/>}
                    </Badge>
                </HStack>
            </Center>

    )
}
