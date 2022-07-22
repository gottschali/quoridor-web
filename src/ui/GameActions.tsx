import { ArrowBackIcon, InfoOutlineIcon, RepeatIcon, SettingsIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Center, Flex, HStack, IconButton, Tooltip } from "@chakra-ui/react";
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
            <Tooltip label="Open game settings">
                <IconButton
                    size='lg'
                    onClick={()=>setShowSettings(true)}
                    aria-label='Open game settings'
                    icon={<SettingsIcon />}
                />
            </Tooltip>

            <Tooltip label="Undo the last move">
                <IconButton
                    size='lg'
                    onClick={undo}
                    aria-label='Undo move'
                    icon={<ArrowBackIcon />}
                />
            </Tooltip>
            <IconButton
                size='lg'
                onClick={()=>setOpen(false)}
                aria-label='Toggle actions'
                icon={<TriangleUpIcon />}
            />

            <Tooltip label="Open the rules">
                <IconButton
                    size='lg'
                    onClick={showRules}
                    aria-label='Show the rules'
                    icon={<InfoOutlineIcon />}
                />
            </Tooltip>

            <Tooltip label="Reset the game">
                <IconButton
                    size='lg'
                    onClick={reset}
                    aria-label='Reset the game'
                    icon={<RepeatIcon />}
                />
            </Tooltip>
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
