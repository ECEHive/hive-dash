import { createContext, useContext, useState } from 'react';

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    HStack,
    useDisclosure
} from '@chakra-ui/react';

const ConfirmationDialogContext = createContext({});

export default function useConfirmation() {
    return useContext(ConfirmationDialogContext);
}

export function ConfirmDialogProvider({ children }) {
    const { isOpen, onClose: onCloseModal, onOpen } = useDisclosure();

    const [header, setHeader] = useState('');
    const [message, setMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState(null);
    const [onClose, setOnClose] = useState(null);
    const [confirmButtonColor, setConfirmButtonColor] = useState('red');
    const [confirmButtonText, setConfirmButtonText] = useState('Confirm');

    function confirm({
        header,
        message,
        confirmButtonText = 'Confirm',
        confirmButtonColor = 'red',
        onConfirm,
        onClose
    }) {
        setHeader(header);
        setMessage(message);
        setOnConfirm(() => onConfirm);
        setOnClose(() => onClose);
        setConfirmButtonColor(confirmButtonColor);
        setConfirmButtonText(confirmButtonText);
        onOpen();
    }

    function onComplete() {
        onCloseModal();
        onClose();
    }

    function onRespond() {
        onConfirm();
        onComplete();
    }

    return (
        <>
            <ConfirmationDialogContext.Provider value={confirm}>
                <AlertDialog
                    isOpen={isOpen}
                    onClose={onComplete}
                    isCentered
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader>{header}</AlertDialogHeader>
                            <AlertDialogBody>{message}</AlertDialogBody>
                            <AlertDialogFooter>
                                <HStack spacing={3}>
                                    <Button onClick={onComplete}>Cancel</Button>
                                    <Button
                                        colorScheme={confirmButtonColor}
                                        onClick={() => {
                                            onRespond();
                                        }}
                                    >
                                        {confirmButtonText}
                                    </Button>
                                </HStack>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>

                {children}
            </ConfirmationDialogContext.Provider>
        </>
    );
}
