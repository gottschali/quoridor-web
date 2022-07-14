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
                <HStack >
                    {game.state.isGameOver()
                        ? <Badge fontSize='ml' colorScheme={currentAgent.isMachine ? 'green' : 'red'}> Winner: {icon}</Badge>
                        : <Badge fontSize='ml'> Winner: undecided </Badge>
                    }
                    <Badge fontSize='ml' variant={game.state.currentPlayer === Player.white ? 'outline' : 'solid'} colorScheme='blackAlpha'>
                        turn: {game.turn}
                    </Badge>
                    <Badge fontSize='ml'  variant='outline' colorScheme='blackAlpha'>
                        <Text color='black'>
                        walls ○ : {game.state.wallsAvailable[Player.white]}
                        </Text>
                    </Badge>
                    <Badge fontSize='ml' variant='solid' colorScheme='blackAlpha'>
                        walls ●: {game.state.wallsAvailable[Player.black]}
                    </Badge>
                    <Badge fontSize='ml'>Player: {currentAgent.name}
                        {icon}
                    </Badge>
                    <Badge fontSize='ml'>
                        {currentAgent.isMachine && !game.state.isGameOver() && <CircularProgress isIndeterminate size='1em'/>}
                        {!currentAgent.isMachine && 'Your turn'}
                    </Badge>
                </HStack>
            </Center>

    )
}
