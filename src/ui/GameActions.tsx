import { ArrowBackIcon, InfoOutlineIcon, RepeatIcon, SettingsIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Center, Flex, HStack, IconButton } from "@chakra-ui/react";
import { Dispatch, useState } from "react";

interface Props {
    setShowSettings: Dispatch<boolean>;
    reset: () => void;
    undo: () => void;
    showRules: () => void;
}

export function GameActions({setShowSettings, reset, undo, showRules}: Props) {
    const [open, setOpen] = useState(true);
    const content =  open ? (
        <>

            <IconButton
                size='lg'
                onClick={()=>setShowSettings(true)}
                aria-label='Open game settings'
                icon={<SettingsIcon />}
            />

            <IconButton
                size='lg'
                onClick={undo}
                aria-label='Undo move'
                icon={<ArrowBackIcon />}
            />
            <IconButton
                size='lg'
                onClick={()=>setOpen(false)}
                aria-label='Toggle actions'
                icon={<TriangleUpIcon />}
            />

            <IconButton
                size='lg'
                onClick={showRules}
                aria-label='Show the rules'
                icon={<InfoOutlineIcon />}
            />

            <IconButton
                size='lg'
                onClick={reset}
                aria-label='Reset the game'
                icon={<RepeatIcon />}
            />
        </>
        ): (
            <IconButton
                size='lg'
                onClick={()=>setOpen(true)}
                aria-label='Reset the game'
                icon={<TriangleDownIcon />}
            />
        );


    return (
        <Center>
            <HStack spacing={4}>
                {content}
            </HStack>
        </Center>
    )

}
