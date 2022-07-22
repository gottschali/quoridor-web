import { Text, Container, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Tab, TabList, TabPanel, TabPanels, Tabs, Button, Icon, Link, Divider, HStack, Accordion, AccordionButton, Box, AccordionIcon, AccordionItem, AccordionPanel, ListItem, List } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { QuoridorBoard } from "./QuoridorBoard";
import { useGame } from "./useGame";

interface Props {
    open: boolean;
    close: ()=>void;
    hideRules: ()=>void;
}

export function Rules({open, close, hideRules}: Props) {
    const [tabIndex, setTabIndex] = useState<number>(0)
    const handleTabsChange = (index: number) => {
        setTabIndex(index)
    }
    return (
       <Modal isOpen={open} onClose={close} size='xl'>
           <ModalOverlay />
           <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Tabs index={tabIndex} onChange={handleTabsChange}>
                        <TabList>
                            <Tab>  Rules</Tab>
                            <Tab>About</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <TabOne close={close} hideRules={hideRules}/>
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

function TabOne({close, hideRules}: {close: ()=>void, hideRules: ()=>void}) {
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
        }, 800);
        } else {
            setTimeout(() => {
                game.reset(game.state.settings);
                setIndex(0);
            }, 5000);
        }
    }, [index]);
    return (
       <Container>
           <Accordion>
               <AccordionItem>
               <AccordionButton>
                   <Box flex='1' textAlign='left'>
                       The Goal of the Game
                   </Box>
                   <AccordionIcon />
               </AccordionButton>
               <AccordionPanel>
                    The goal of the game is to reach the opposite side of the board with your pawn.
                    Your opponent tries to do the same so make sure you are the faster one!
                    Either you can move your pawn like a king in chess.
                    That is move it to a square next to it.
                    The other option is to place a wall to create obstacles for your opponent or support yourself.

                    Here a short example of a game is shown:
               </AccordionPanel>

               </AccordionItem>

               <AccordionItem>
               <AccordionButton>
                   <Box flex='1' textAlign='left'>
                       Example Game
                   </Box>
                   <AccordionIcon />
               </AccordionButton>
               <AccordionPanel>
                   <QuoridorBoard game={game} controlled={true} submitMove={(move)=>{console.log(move)}}/>
               In this game the white player wins because he reaches the top row first while the black player is still some squares away.
               The normal game is usually played on a bigger 9x9 board where
               each player has 10 walls at his disposal.
               </AccordionPanel>

               </AccordionItem>

               <AccordionItem>
               <AccordionButton>
                   <Box flex='1' textAlign='left'>
                       Jumps
                   </Box>
                   <AccordionIcon />
               </AccordionButton>
               <AccordionPanel>
               You may have noticed in the example game that you can jump over your opponent if he is next to you.
               But never over a wall.
               The moves you can make are marked with gray spots on the board so it should be always clear what is legal or not.
               </AccordionPanel>
               </AccordionItem>

               <AccordionItem>
               <AccordionButton>
                   <Box flex='1' textAlign='left'>
                       Walls
                   </Box>
                   <AccordionIcon />
               </AccordionButton>
               <AccordionPanel>
               For walls there is an additional rule:
               It is not allowed to place a wall that would cut the only way of you or your opponent to the finishline.
               In other words: you are not allowed to cage a pawn.
               This just prevents the game from being boring.
               Also you the walls can't overlap.
               If have a mouse you can hover over the lines to see the possibilities.
               To place it just click on grid line.
               Because walls are 2 squares long it will be placed in the direction closest to your click.
               </AccordionPanel>
               </AccordionItem>
           </Accordion>

           <HStack p={4}>
            <Button colorScheme='purple' onClick={close}>
                    PLAY
                </Button>
                <Button colorScheme='blackAlpha' onClick={hideRules}>
                Don't show this again.
                </Button>
           </HStack>

       </Container>
    )
}

function About() {
    return (
        <Container p={2} m={2}>
            <Link color='teal.500' href="https://boardgamegeek.com/boardgame/624/quoridor" isExternal>Quoridor</Link> is an abstract board game with simple rules but is surprinsingly complex to master.

            <Divider />

            This site was created using
            <List>
                <ListItem>
                    <Link color='teal.500' href="https://create-react-app.dev/" isExternal>create-react-app </Link>
                </ListItem>
                <ListItem>
                    <Link color='teal.500' href="https://chakra-ui.com/" isExternal>chakra-ui </Link>
                </ListItem>
                <ListItem>
                    written in <Link color='teal.500' href="https://www.typescriptlang.org/" isExternal>Typescript </Link>
                </ListItem>
            </List>

            <Divider />

            <Link color='teal.500' href="https://github.com/gottschali/quoridor-web" isExternal>
                <Text> You can view the source on Github
                <Icon viewBox="0 0 496 512">
                    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
                </Icon>
                </Text>
            </Link>

            <Divider />

            If you like Quoridor you might also enjoy the game Hive.
            <br/>
            <Link color='teal.500' href="hive.gschall.ch/" isExternal>
                Check out my web version.
            </Link>

            <Divider />
            Created by Ali Gottschall (2022)
            <br/>
            <Link color='teal.500' href="mailto://post@aligottschall.ch"> Send some feedback </Link>
        </Container>
    )
}
