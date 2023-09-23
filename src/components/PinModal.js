import {
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField
} from '@chakra-ui/react';

export default function PinModal({}) {
    return (
        <>
            <Modal
                isOpen={false}
                isCentered
                size="xs"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>PI Access</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <HStack
                            w="full"
                            justify="space-evenly"
                        >
                            <PinInput size="lg">
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                        </HStack>
                    </ModalBody>
                    <ModalFooter />
                </ModalContent>
            </Modal>
        </>
    );
}
