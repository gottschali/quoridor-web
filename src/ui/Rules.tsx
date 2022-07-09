import { Text, Container, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { QuoridorBoard } from "./QuoridorBoard";
import { useGame } from "./useGame";

interface Props {
    open: boolean;
    close: ()=>void;
}

export function Rules({open, close}: Props) {
    const [tabIndex, setTabIndex] = useState<number>(0)

    /* const handleSliderChange = (event) => {
*     setTabIndex(parseInt(event.target.value, 10))
* } */

    const handleTabsChange = (index: number) => {
        setTabIndex(index)
    }
    return (
       <Modal isOpen={open} onClose={close}>
           <ModalOverlay />
           <ModalContent>
               <ModalHeader>
                   {(tabIndex === 0) && "The Rules"}
                   {(tabIndex === 1) && "About"}
               </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Tabs index={tabIndex} onChange={handleTabsChange}>
                        <TabList>
                            <Tab>Rules</Tab>
                            <Tab>About</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <TabOne close={close}/>
                            </TabPanel>
                            <TabPanel>
                                <About />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

function TabOne({close}: {close: ()=>void}) {
    const game = useGame({boardWidth:5, boardHeight: 5});
    const [index, setIndex] = useState(0);

    const moves = [
        "b3", "c2h", "b4", "d3", "d3h", "d2",
        "c4", "c2", "c3", "c4", "c5", "c4h",
        "e4h", "c3", "d5", "c2", "d4", "d3v",
        "d5", "c1", "c5", "b1", "b1h", "b2",
        "c4", "b3", "c3", "a3",
    ]
    useEffect(() => {
        if (index < moves.length) {
            setTimeout(() => {
                game.proposeMove(moves[index]);
                setIndex(index + 1);
        }, 1200);
        } else {
            setTimeout(() => {
                game.reset(game.state.settings);
                setIndex(0);
            }, 5000);
        }
    }, [index]);
    return (
       <Container>
           <p>
               The goal of the game is to reach the opposite side with your pawn.
               It can move to a neighboring square or you may place a wall.
           </p>

           <QuoridorBoard game={game} controlled={true} submitMove={(move)=>{console.log(move)}}/>

           <p>
               In this game the white player wins because he reaches the top row first while the black player is still some squares away.
               The normal game is usually played on a bigger 9x9 board where
               each player has 10 walls at his disposal.
           </p>

           <p>
               You may have noticed in the example game that you can jump over your opponent.
               But never over a wall.
           </p>

           <p>
               It is not allowed to place a wall that would cut the only way of you or your opponent's.
               In other words: you are not allowed to cage a pawn.
           </p>
           <p>
               Now go on an try it out yourself!
           </p>

           <Button colorScheme='purple' onClick={close}>
                PLAY
            </Button>


       </Container>
    )
}

function About() {
    return (
        <Container>
            TODO
        </Container>
    )
}
