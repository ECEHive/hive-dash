import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button
} from '@chakra-ui/react';

export default function CompleteConfirm({ isOpen, onClose, confirm }) {
    return (
        <AlertDialog
            isOpen
            motionPreset="slideInBottom"
        >
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader>Confirm print removal</AlertDialogHeader>

                <AlertDialogBody>
                    Confirm the print has been removed from the tray and the printer is ready for the next print.
                </AlertDialogBody>

                <AlertDialogFooter gap={3}>
                    <Button>Cancel</Button>
                    <Button colorScheme="green">Confirm</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
