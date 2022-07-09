import { Badge, Center, CircularProgress, HStack, Text } from "@chakra-ui/react";
import { type Agent } from "../agents/Agent";
import { Player } from "../quoridor/Player";
import { useGame } from "./useGame";

interface Props {
   currentAgent: Agent;
    game: useGame;
}

export function GameInformation({currentAgent, game}: Props) {
    const icon = game.state.winner() === Player.white ? "○" : "●";

    return (
            <Center>
                <HStack>
                    {game.state.isGameOver()
                        ? <Badge colorScheme={!currentAgent.isMachine ? 'green' : 'red'}> Winner: {icon}</Badge>
                        : <Badge> Winner: undecided </Badge>
                    }
                    <Badge variant={game.state.currentPlayer === Player.white ? 'outline' : 'solid'} colorScheme='blackAlpha'>
                        turn: {game.turn}
                    </Badge>
                    <Badge variant='outline' colorScheme='blackAlpha'>
                        <Text color='black'>
                        walls ○ : {game.state.wallsAvailable[Player.white]}
                        </Text>
                    </Badge>
                    <Badge variant='solid' colorScheme='blackAlpha'>
                        walls ●: {game.state.wallsAvailable[Player.black]}
                    </Badge>
                    <Badge>Player: {currentAgent.name}
                        {icon}
                    </Badge>
                    <Badge>
                        {currentAgent.isMachine && !game.state.isGameOver() && <CircularProgress isIndeterminate size='1em'/>}
                        {!currentAgent.isMachine && 'Your turn'}
                    </Badge>
                </HStack>
            </Center>

    )
}
