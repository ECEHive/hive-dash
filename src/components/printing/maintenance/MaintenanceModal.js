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

import usePrinterUpdate from '@/hooks/usePrinterUpdate';

export default function MaintenanceModal({ open, onClose, printerData }) {
    const [data, setData] = useState(printerData);
    const printerUpdater = usePrinterUpdate();

    const save = useCallback(() => {
        printerUpdater(data._id, data);
        onClose();
    }, [data, printerUpdater, onClose]);

    useEffect(() => {
        setData(printerData);
    }, [printerData]);

    return (
        <Modal isOpen={open} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent minW="500px">
                <ModalHeader>
                    Maintenance - {printerData.displayName}
                </ModalHeader>
                <ModalBody>
                    <VStack w="100%" h="100%" spacing={3}>
                        <FormControl>
                            <FormLabel>Printer enabled</FormLabel>
                            <InputGroup>
                                <Switch
                                    isChecked={data.enabled}
                                    onChange={(e) => {
                                        setData((old) => {
                                            return {
                                                ...old,
                                                enabled: e.target.checked
                                            };
                                        });
                                    }}
                                />
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
                                    value={data.maintenance.notes}
                                    onChange={(e) =>
                                        setData((old) => {
                                            return {
                                                ...old,
                                                maintenance: {
                                                    ...old.maintenance,
                                                    notes: e.target.value
                                                }
                                            };
                                        })
                                    }
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
                        {/* <Box>
                            <ReactMarkdown
                                components={ChakraUIRenderer()}
                                skipHtml
                            >
                                {md}
                            </ReactMarkdown>
                        </Box> */}
                    </VStack>
                </ModalBody>
                <ModalFooter spacing={3}>
                    <HStack spacing={3}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button colorScheme="blue" onClick={save}>
                            Save
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
