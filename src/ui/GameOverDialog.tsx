import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react";
import { useRef } from "react";
import { Player } from "../quoridor/Player";

interface Props {
    reset: ()=>void;
    open: boolean;
    close: ()=>void;
    winner: Player|null;
}

export function GameOverDialog({reset, open, close,winner}: Props) {
    const cancelRef = useRef<HTMLElement>(null);
    return (
        <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={reset}
            isOpen={open}
            isCentered
        >
            <AlertDialogOverlay />

            <AlertDialogContent>
                <AlertDialogHeader>The game has ended</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    The player {winner === Player.white ? "○" : "●"} has reached the opposite side of the board.
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button onClick={close}>
                        Back to the board
                    </Button>
                    <Button onClick={reset} colorScheme='red' ml={3}>
                        Reset
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
