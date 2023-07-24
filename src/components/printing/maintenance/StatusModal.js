import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import {
    Box,
    Button,
    ButtonGroup,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Switch,
    Text,
    Textarea,
    VStack
} from '@chakra-ui/react';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

export default function MaintenanceModal({ open, onClose }) {
    return (
        <Modal isOpen={open} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent minW="500px">
                <ModalHeader></ModalHeader>
                <ModalBody>
                    <Box>
                        <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                            {md}
                        </ReactMarkdown>
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
