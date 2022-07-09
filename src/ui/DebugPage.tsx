import { GameController } from "./GameController";
import { HumanAgent } from "../agents/HumanAgent";
import { ChangeEvent, useEffect, useState } from "react";
import { QuoridorBoard } from "./QuoridorBoard";
import { useGame } from "./useGame";
import { State } from "../quoridor/State";
import { Box, Textarea, Text, Button } from "@chakra-ui/react";


export function DebugPage() {

    return (
        <div>
            <GameController />
        </div>
    )
}

function Debug() {
    const game: useGame = useGame({});
    let [value, setValue] = useState(game.state.toNotation());

    let handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        let inputValue = e.target.value;
        setValue(inputValue);
    }
    const load = ( ) => {
        game.update(State.fromNotation(value, game.state.settings));
    }

    const loadNotationFromBoard = () => {
        setValue(game.state.toNotation());
    }
    return (
            <Box w="100%" p={5} className='board-container' bg="orange.200">
                <Text mb='8px'>Value: {value}</Text>
                <Text mb='8px'> {[...game.state.legalMoves.entries()]}</Text>
                <Textarea
                        value={value}
                        onChange={handleInputChange}
                        placeholder='Here is a sample placeholder'
                        size='sm'
                    />
                <Button onClick={load}>Set from input</Button>
                <Button onClick={loadNotationFromBoard}>Load from board</Button>
                <QuoridorBoard controlled={true} game={game} submitMove={game.proposeMove} />
            </Box>
    )
}
