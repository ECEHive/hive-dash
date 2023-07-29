import { useCallback, useState } from 'react';

import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Icon,
    Input,
    InputGroup,
    InputRightAddon,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    VStack,
    chakra,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';

import Editor from '@monaco-editor/react';
import { Select } from 'chakra-react-select';

import iconSet from '@/util/icons';
import { PITypes } from '@/util/roles';

const ChakraEditor = chakra(Editor);

export default function BatchAddModal({ isOpen, onClose }) {
    const toast = useToast();

    const [input, setInput] = useState('');
    const editorTheme = useColorModeValue('vs-light', 'vs-dark');

    const copyTemplate = useCallback(() => {
        navigator.clipboard.writeText(
            JSON.stringify(
                [
                    {
                        name: 'John Doe',
                        email: 'jdoe2',
                        type: 0
                    }
                ],
                null,
                4
            )
        );
        toast({
            title: 'Template copied to clipboard',
            status: 'success',
            duration: 3000
        });
    }, [toast]);

    const save = useCallback(() => {
        const data = {
            type: 'batch',
            data: input
        };
        fetch('/api/peerInstructors/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((data) => {
                onClose();
            });
    }, [input, onClose]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                isCentered
                scrollBehavior="inside"
                size="xl"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Batch add PIs</ModalHeader>
                    <ModalBody>
                        <VStack
                            align="start"
                            h="full"
                        >
                            <Button
                                leftIcon={<Icon as={iconSet.copy} />}
                                onClick={copyTemplate}
                            >
                                Copy template
                            </Button>

                            <FormControl
                                h="full"
                                flexGrow={1}
                            >
                                <FormLabel>JSON Input</FormLabel>
                                <ChakraEditor
                                    minHeight="400px"
                                    flexGrow={1}
                                    language="json"
                                    theme={editorTheme}
                                    options={{
                                        minimap: {
                                            enabled: true
                                        }
                                    }}
                                    onChange={(value) => setInput(JSON.parse(value))}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter gap={3}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            colorScheme="blue"
                            onClick={save}
                        >
                            Confirm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
