import { useState } from 'react';
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
    const markdown =
        '# this is a test!\nhi how are you\nis this a [link](https://google.com) or is it not?';

    const [md, setMd] = useState('');

    return (
        <Modal isOpen={open} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent minW="500px">
                <ModalHeader>Maintenance - Ultimaker 1</ModalHeader>
                <ModalBody>
                    <VStack w="100%" h="100%" spacing={3}>
                        <FormControl>
                            <FormLabel>Printer enabled</FormLabel>
                            <InputGroup>
                                <Switch />
                            </InputGroup>
                            <FormHelperText>
                                Disable to prevent any new prints from being
                                queued
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Printer status</FormLabel>
                            <InputGroup>
                                <Textarea
                                    value={md}
                                    onChange={(e) => setMd(e.target.value)}
                                    placeholder="use some markdown!"
                                    resize="vertical"
                                />
                            </InputGroup>
                            <FormHelperText>
                                Description of the printer&apos;s current
                                status, i.e. &quot;the bed isn&apos;t
                                level&quot;
                            </FormHelperText>
                        </FormControl>
                        <Box>
                            <ReactMarkdown
                                components={ChakraUIRenderer()}
                                skipHtml
                            >
                                {md}
                            </ReactMarkdown>
                        </Box>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button>save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
