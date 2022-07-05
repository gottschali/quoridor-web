import { Button, ButtonGroup, FormControl, FormLabel, HStack, NumberInput, NumberInputField, NumberInputStepper, Select, Text } from "@chakra-ui/react";
import { ReactElement, useState } from "react";
import { Agent } from "../agents/Agent";
import { HumanAgent } from "../agents/HumanAgent";
import { MinMaxAgent } from "../agents/MinMaxAgent";
import { RandomAgent } from "../agents/RandomAgent";
import { wallsHeuristic } from "../agents/wallsHeuristic";
import { Player } from "../quoridor/Player";
import { GameController } from "./GameController";

export type Agents = 'naive' | 'MinMax2' | 'MinMax3' | 'MinMaxHeuristic' | 'human' | 'random';

/**
 * Need to figure out how to do this nicely...
   this can't be the way
 */

interface agentList {
    naive: Agent,
    MinMax2: Agent,
    MinMax3: Agent,
    MinMaxHeuristic: Agent,
    human: Agent,
    random: Agent,
}

export const agentList: agentList = {
    naive: MinMaxAgent(1),
    MinMax2: MinMaxAgent(2),
    MinMax3: MinMaxAgent(3),
    MinMaxHeuristic: MinMaxAgent(3, wallsHeuristic),
    human: HumanAgent,
    random: RandomAgent,
}

function AgentSelect({selectedAgent, setSelectedAgent}: {selectedAgent: any, setSelectedAgent: any}) {

    const selectAgent = (agent: Agents) => {
        console.log("setting agent", agentList[agent]);
        setSelectedAgent(agentList[agent])
    }

    return  <Select placeholder="Select an agent">
        {Object.keys(agentList).map((agent) => {
                    return (<option key={agent} value={agent} onClick={()=>selectAgent(agent as Agents)}>
                            {agent}
                        </option>
                    )
                })}
            </Select>
}


export function GameSetup(props: any) {


    return <FormControl maxW='sm' className='gameSetup'>
                <h2> Configure the game </h2>
                <div> {props.whiteAgent}, {props.blackAgent} </div>
                <AgentSelect selectedAgent={props.whiteAgent} setSelectedAgent={props.setWhiteAgent}/>
                <AgentSelect selectedAgent={props.blackAgent} setSelectedAgent={props.setBlackAgent} />
            <FormLabel htmlFor='boardSize'>Board Dimension </FormLabel>
                <HStack id='boardSize'>
                    <Text>These settings do not yet take effect</Text>
                    <NumberInput size='sm' maxW={16} display='flex' defaultValue={9} min={3} max={20}>
                        <NumberInputField />
                    </NumberInput>
                    <Text>x</Text>
                    <NumberInput size='sm' maxW={16} display='flex' defaultValue={9} min={3} max={20}>
                        <NumberInputField />
                </NumberInput>
                </HStack>

            <FormLabel htmlFor='numWalls'>Number of walls available</FormLabel>
                <NumberInput id='numWalls' defaultValue={10} min={0} max={20}>
                    <NumberInputField />
                </NumberInput>
                <ButtonGroup>
                <Button colorScheme='green' onClick={props.createGame}>
                        Create Game
                    </Button>
                </ButtonGroup>

        </FormControl>
}
