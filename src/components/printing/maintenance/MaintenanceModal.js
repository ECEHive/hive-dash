import { useCallback, useEffect, useState } from 'react';

import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    InputGroup,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Switch,
    Textarea,
    VStack
} from '@chakra-ui/react';

import usePrinterUpdate from '@/hooks/printing/usePrinterUpdate';

export default function MaintenanceModal({ isOpen, onClose, printerData }) {
    const [data, setData] = useState(null);
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
        setData(printerData);
    }, [printerData]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="2xl"
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <ModalContent h="container.sm">
                {data && (
                    <>
                        <ModalHeader>Maintenance - {data.displayName}</ModalHeader>
                        <ModalBody h="100%">
                            <VStack
                                w="full"
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
                                            h="auto"
                                        />
                                    </InputGroup>
                                    <FormHelperText>
                                        Description of the printer&apos;s current status, i.e. &quot;the bed isn&apos;t
                                        level&quot;. Markdown is supported.
                                    </FormHelperText>
                                </FormControl>
                            </VStack>
                        </ModalBody>
                    </>
                )}
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
