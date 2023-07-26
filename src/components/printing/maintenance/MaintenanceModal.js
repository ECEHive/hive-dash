import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardBody,
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

export default function MaintenanceModal({ isOpen, onClose, printerData }) {
    const [data, setData] = useState(printerData);
    const [saving, setSaving] = useState(false);
    const printerUpdater = usePrinterUpdate();

    const save = useCallback(() => {
        setSaving(true);
        printerUpdater(data._id, data)
            .then(() => {
                setSaving(false);
                onClose();
            })
            .catch((err) => {
                setSaving(false);
                console.error(err);
            });
    }, [data, printerUpdater, onClose]);

    useEffect(() => {
        console.log(printerData);
        setData(printerData);
    }, [printerData]);

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
                <ModalHeader>Maintenance - {printerData.displayName}</ModalHeader>
                <ModalBody h="100%">
                    <HStack
                        w="100%"
                        h="100%"
                        spacing={3}
                    >
                        <VStack
                            w="50%"
                            h="100%"
                            spacing={3}
                        >
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
                                <FormHelperText>Disable to prevent any new prints from being queued</FormHelperText>
                            </FormControl>
                            <FormControl
                                flexGrow={1}
                                display="flex"
                                flexDir="column"
                            >
                                <FormLabel>Printer status</FormLabel>
                                <InputGroup flexGrow={1}>
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
                                        resize="none"
                                        h="full"
                                    />
                                </InputGroup>
                                <FormHelperText>
                                    Description of the printer&apos;s current status, i.e. &quot;the bed isn&apos;t
                                    level&quot;. Markdown is supported.
                                </FormHelperText>
                            </FormControl>
                        </VStack>

                        <Card
                            variant="outline"
                            bgColor="transparent"
                            w="50%"
                            h="full"
                        >
                            <CardBody
                                h="100%"
                                overflow="auto"
                            >
                                {data.maintenance.notes.length > 0 ? (
                                    <ReactMarkdown
                                        components={ChakraUIRenderer()}
                                        skipHtml
                                        h="100%"
                                    >
                                        {data.maintenance.notes}
                                    </ReactMarkdown>
                                ) : (
                                    <VStack
                                        h="100%"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <Text color="gray.400">enter some notes</Text>
                                    </VStack>
                                )}
                            </CardBody>
                        </Card>
                    </HStack>
                </ModalBody>
                <ModalFooter spacing={3}>
                    <HStack spacing={3}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            colorScheme="blue"
                            onClick={save}
                            isLoading={saving}
                        >
                            Save
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
