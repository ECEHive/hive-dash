import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    HStack
} from '@chakra-ui/react';

export default function DeleteDialog({ isOpen, onClose, onDelete, header, message }) {
    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader>{header}</AlertDialogHeader>

                    <AlertDialogBody>{message}</AlertDialogBody>

                    <AlertDialogFooter>
                        <HStack spacing={3}>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button
                                colorScheme="red"
                                onClick={() => {
                                    onDelete();
                                    onClose();
                                }}
                            >
                                Delete
                            </Button>
                        </HStack>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}
