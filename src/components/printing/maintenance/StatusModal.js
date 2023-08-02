import {
    Box,
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';

export default function StatusModal({ isOpen, onClose, printerData }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="6xl"
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <ModalContent h="container.sm">
                <ModalHeader>Maintenance notes - {printerData.displayName}</ModalHeader>
                <ModalBody>
                    <Box>
                        {printerData.maintenance.notes?.length > 0 ? (
                            <ReactMarkdown
                                components={ChakraUIRenderer()}
                                skipHtml
                            >
                                {printerData.maintenance.notes}
                            </ReactMarkdown>
                        ) : (
                            <Text color="secondaryText">No maintenance notes.</Text>
                        )}
                    </Box>
                </ModalBody>
                <ModalFooter spacing={3}>
                    <HStack spacing={3}>
                        <Button onClick={onClose}>Close</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
