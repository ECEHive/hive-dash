import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import {
    Button,
    ButtonGroup,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Input,
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
                <ModalHeader>Maintenance</ModalHeader>
                <ModalBody>
                    {/* <VStack w="100%" h="100%" align="start" spacing={1}>
                        <Heading size="md" lineHeight={1}>
                            Ultimaker 2
                        </Heading>
                        <Text fontSize="xs" color="gray.500">
                            id: ultimaker-2
                        </Text>
                    </VStack> */}
                    <VStack w="100%" h="100%">
                        <FormControl>
                            <FormLabel>Printer enabled</FormLabel>
                            {/* <ButtonGroup isAttached variant="outline">
                                <Button colorScheme="green">Enabled</Button>
                                <Button colorScheme="red">Disabled</Button>
                            </ButtonGroup> */}
                            <Switch />
                            <FormHelperText>
                                disable to prevent new prints from being queued
                            </FormHelperText>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Printer status</FormLabel>
                            <Textarea
                                value={md}
                                onChange={(e) => setMd(e.target.value)}
                                placeholder="use some markdown!"
                            ></Textarea>
                        </FormControl>
                        <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
                            {md}
                        </ReactMarkdown>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button>save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
