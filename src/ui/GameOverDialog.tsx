import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react";
import { useRef } from "react";

interface Props {
    reset: ()=>void;
    open: boolean;
    close: ()=>void;
}

export function GameOverDialog({reset, open, close}: Props) {
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
                    A player has reached the opposite side of the board.
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
