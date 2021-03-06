import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Button, Center, Container, Flex, FormControl, FormLabel, HStack, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Spacer, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { ChangeEvent, Dispatch, useState } from "react";
import { Agent } from "../agents/Agent";
import { AIAgent } from "../agents/AIAgent";
import { HumanAgent } from "../agents/HumanAgent";
import { MCTSAgent } from "../agents/MCTSAgent";
import { MinMaxAgent } from "../agents/MinMaxAgent";
import { RandomAgent } from "../agents/RandomAgent";
import { ShortestPathAgent } from "../agents/ShortestPathAgent";
import { Player } from "../quoridor/Player";
import { MandatoryGameSettings } from "../quoridor/State";

// https://stackoverflow.com/questions/57350092/string-cant-be-used-to-index-type
interface agentList {
    [key: string]: Agent;
}

export const agentList: agentList = {
    human: HumanAgent,
    // MinMax2: MinMaxAgent(2),
    // random: RandomAgent,
    // MCTS: MCTSAgent(),
    // naive: MinMaxAgent(1),
    // MinMax3: MinMaxAgent(3),
    // MinMax4: MinMaxAgent(4),
    // MinMaxINF: MinMaxAgent(Number.POSITIVE_INFINITY),
    // shortest: ShortestPathAgent,
    AI: AIAgent(),
}

interface AgentSelectProps {
    setAgent: Dispatch<Agent>;
    player: Player;
}
function AgentSelect({setAgent, player}: AgentSelectProps) {
    const onChange = (e: ChangeEvent<HTMLSelectElement>)=>{
        setAgent(agentList[e.target.value])
    }

    return  <Select w='xs'
                    defaultValue={player === Player.white ? "human" : "AI"}
                    onChange={onChange}
                    m={2}
                    bg={player === Player.white ? "white" : "black"}
                    color={player === Player.white ? "black" : "white"}
            >
        {Object.keys(agentList).map((agent) => {
                    return (
                        <option key={agent} value={agent}>
                            {agent}
                        </option>
                    )
                })}
            </Select>
}

interface Props {
    open: boolean;
    close: ()=>void;
    submitSettings: (whiteAgent: Agent, blackAgent: Agent, settigns: MandatoryGameSettings)=>void;
}

export function GameSetup({open, close, submitSettings}: Props) {
    const [bw, setBw] = useState("7");
    const [bh, setBh] = useState("7");
    const [nw, setNw] = useState("7");
    const [whiteAgent, setWhiteAgent] = useState<Agent>(HumanAgent);
    const [blackAgent, setBlackAgent] = useState<Agent>(AIAgent);
    const [showAdvanced, setShowAdvanced] = useState(false);


    const createGame = () => {
        console.log("submit", whiteAgent, blackAgent);
        submitSettings(whiteAgent, blackAgent, {
            pawns: 1,
            boardWidth: Number.parseInt(bw),
            boardHeight: Number.parseInt(bh),
            walls: Number.parseInt(nw),
        })
        // Reset to default values
        // such that there is no inconsitency between ui and state
        setWhiteAgent(HumanAgent);
        setBlackAgent(AIAgent);
    }

    return (
       <Modal isOpen={open} onClose={close}>
           <ModalOverlay />
           <ModalContent>
               <ModalHeader>
                   Game Settings
                   <Tooltip label='Show advanced settings'>
                    <IconButton
                        size='2em'
                        onClick={()=>setShowAdvanced(!showAdvanced)}
                        aria-label='Hide/show advanced settings'
                        icon={showAdvanced ? <TriangleUpIcon /> : <TriangleDownIcon />}
                    />
                   </Tooltip>
               </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Container centerContent>
                        <FormControl className='gameSetup'>
                        <Flex>
                            <AgentSelect setAgent={setWhiteAgent} player={Player.white}/>
                            <Text m={2} fontSize='2xl' fontStyle='bold'> VS </Text>
                            <AgentSelect setAgent={setBlackAgent} player={Player.black}/>
                        </Flex>

                    {showAdvanced ?
                     <>
                         <HStack>
                             <FormLabel htmlFor='boardSize'>Board Dimension </FormLabel>
                             <Spacer />
                             <FormLabel htmlFor='numWalls'>Number of walls </FormLabel>
                         </HStack>
                         <HStack id='boardSize' p={2} >
                            <NumberInput value={bh} size='sm' maxW={16} display='flex' defaultValue={9} min={3} max={20}
                                onChange={v => setBh(v)}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Text>x</Text>
                            <NumberInput value={bw} size='sm' maxW={16} display='flex' defaultValue={9} min={3} max={20}
                                onChange={v => setBw(v)}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Spacer />
                            <NumberInput value={nw} size='sm' maxW={16} display='flex' id='numWalls' defaultValue={10} min={0} max={20}
                                onChange={v => setNw(v)}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </HStack>

                     </> : <div/>
                    }
                        <Center>
                            <Button bg='orange.200' onClick={createGame}>
                                Create Game
                            </Button>
                        </Center>

                    </FormControl>
                    </Container>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
