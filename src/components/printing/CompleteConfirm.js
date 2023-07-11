import { AlertDialog, AlertDialogHeader, AlertDialogOverlay, AlertDialogContent, AlertDialogBody, AlertDialogFooter, Button } from "@chakra-ui/react";


export default function CompleteConfirm(props){

    return (
        <AlertDialog isOpen>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        Confirm print removal
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Confirm the print has been removed from the tray and the tray is replaced
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button colorScheme="green">
                            Confirm
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}