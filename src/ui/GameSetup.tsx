import { Box, Button, ButtonGroup, Container, Flex, FormControl, FormLabel, Heading, HStack, NumberInput, NumberInputField, NumberInputStepper, Select, Text } from "@chakra-ui/react";
import { Dispatch, ReactElement, useState } from "react";
import { Agent } from "../agents/Agent";
import { HumanAgent } from "../agents/HumanAgent";
import { MinMaxAgent } from "../agents/MinMaxAgent";
import { RandomAgent } from "../agents/RandomAgent";
import { wallsHeuristic } from "../agents/wallsHeuristic";
import { Player } from "../quoridor/Player";
import { GameSettings, GameSettingsDefaults, MandatoryGameSettings } from "../quoridor/State";
import { GameController } from "./GameController";


/**
 * Need to figure out how to do this nicely...
   this can't be the way
 */

interface agentList {
    naive: Agent,
    MinMax2: Agent,
    MinMax3: Agent,
    MinMax4: Agent,
    MinMaxINF: Agent,
    human: Agent,
    random: Agent,
}

export const agentList: agentList = {
    naive: MinMaxAgent(1),
    MinMax2: MinMaxAgent(2),
    MinMax3: MinMaxAgent(3),
    MinMax4: MinMaxAgent(4),
    MinMaxINF: MinMaxAgent(Number.POSITIVE_INFINITY),
    human: HumanAgent,
    random: RandomAgent,
}
export type Agents = 'naive' | 'MinMax2' | 'MinMax3' | 'MinMax4' | 'MinMaxINF' | 'human' | 'random' ;

function AgentSelect({setAgent}: {setAgent: Dispatch<Agent>}) {

    const selectAgent = (agent: Agents) => {
        console.log("setting agent", agentList[agent]);
        setAgent(agentList[agent])
    }

    return  <Select placeholder="human" w='xs'>
        {Object.keys(agentList).map((agent) => {
                    return (<option key={agent} value={agent} onClick={()=>selectAgent(agent as Agents)}>
                            {agent}
                        </option>
                    )
                })}
            </Select>
}

export function GameSetup(props: any) {
    const [bw, setBw] = useState("9");
    const [bh, setBh] = useState("9");
    const [nw, setNw] = useState("10");
    const [whiteAgent, setWhiteAgent] = useState<Agent>(HumanAgent);
    const [blackAgent, setBlackAgent] = useState<Agent>(HumanAgent);


    const createGame = () => {
        props.submitSettings(whiteAgent, blackAgent, {
            pawns: 1,
            boardWidth: Number.parseInt(bw),
            boardHeight: Number.parseInt(bh),
            walls: Number.parseInt(nw),
        })
    }

    return <Container m={2} p={2} centerContent >
            <Heading as='h2'> Game Settings </Heading>

                <FormControl className='gameSetup'>
                    <div> {props.whiteAgent}, {props.blackAgent} </div>

                <Flex>
                    <AgentSelect setAgent={setWhiteAgent}/>
                     vs
                    <AgentSelect setAgent={setBlackAgent} />
                </Flex>
                <FormLabel htmlFor='boardSize'>Board Dimension </FormLabel>
                    <HStack id='boardSize'>
                        <NumberInput value={bh} size='sm' maxW={16} display='flex' defaultValue={9} min={3} max={20}
                                    onChange={v=>setBh(v)}>
                            <NumberInputField />
                        </NumberInput>
                        <Text>x</Text>
                        <NumberInput value={bw} size='sm' maxW={16} display='flex' defaultValue={9} min={3} max={20}
                            onChange={v=>setBw(v)}>
                            <NumberInputField />
                    </NumberInput>
                    </HStack>

                <FormLabel htmlFor='numWalls'>Number of walls </FormLabel>
                <NumberInput value={nw} id='numWalls' defaultValue={10} min={0} max={20}
                              onChange={v => setNw(v)}>
                        <NumberInputField />
                    </NumberInput>
                    <ButtonGroup>
                    <Button colorScheme='green' onClick={createGame}>
                            Create Game
                        </Button>
                    </ButtonGroup>

            </FormControl>
    </Container>
}
