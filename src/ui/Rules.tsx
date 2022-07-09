import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";

interface Props {
    open: boolean;
    close: ()=>void;
}

export function Rules({open, close}: Props) {
    return (
       <Modal isOpen={open} onClose={close}>
           <ModalOverlay />
           <ModalContent>
               <ModalHeader>
                   The Rules
               </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    Nothing here yet
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
