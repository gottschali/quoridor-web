import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react";
import { useRef } from "react";

interface Props {
    playout: ()=>void;
    open: boolean;
    close: ()=>void;
}

export function PlayOutDialog({playout, open, close}: Props) {
    const cancelRef = useRef<HTMLElement>(null);
    return (
        <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={()=>{}}
            isOpen={open}
            isCentered
        >
            <AlertDialogOverlay />

            <AlertDialogContent>
                <AlertDialogHeader>All walls have been placed!</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    The game can be played out automatically
                    or you can finish it by hand if you wish so.
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Button onClick={close}>
                        Manually
                    </Button>
                    <Button onClick={playout} colorScheme='green' ml={3}>
                        Automatically
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
