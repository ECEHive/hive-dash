import { useCallback, useEffect, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    InputGroup,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    useToast
} from '@chakra-ui/react';

import usePrinting from '@/contexts/printing/PrintingContext';

import useRequest from '@/hooks/useRequest';

import { Select } from '@/components/Select';

export default function MoveModal({ isOpen, onClose, originalPrinter, prints }) {
    const request = useRequest();
    const { printers, printerTypes, refreshDynamicData } = usePrinting();

    const toast = useToast();

    const [target, setTarget] = useState(originalPrinter.id);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setTarget(originalPrinter.id);
    }, [originalPrinter.id]);

    const movePrints = useCallback(
        (prints, targetPrinter) => {
            setIsSaving(true);
            request(`/api/printing/queue/move`, {
                method: 'PUT',
                body: JSON.stringify({
                    originalPrinter: originalPrinter.id,
                    targetPrinter: targetPrinter,
                    prints: prints
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    toast({
                        description: `Moved ${prints.length} prints to ${targetPrinter}`,
                        status: 'success',
                        duration: 5000,
                        isClosable: false
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    refreshDynamicData();
                    setIsSaving(false);
                    onClose();
                });
        },
        [request, onClose, originalPrinter.id, toast, refreshDynamicData]
    );

    return (
        <>
            <Modal
                isOpen={isOpen}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Move {prints.length} prints</ModalHeader>

                    <ModalBody>
                        <VStack>
                            <FormControl>
                                <FormLabel>Target printer</FormLabel>
                                <InputGroup>
                                    <Select
                                        w="full"
                                        value={{
                                            label: printers.find((p) => p.id === target)?.displayName,
                                            value: target.id
                                        }}
                                        onChange={(e) => {
                                            setTarget(e.value);
                                        }}
                                        options={printerTypes
                                            .filter((t) => t.id === originalPrinter.type)
                                            .map((type) => {
                                                return {
                                                    label: type.displayName,
                                                    options: printers
                                                        .filter((p) => p.type === type.id)
                                                        .map((p) => {
                                                            return {
                                                                label: `${p.displayName} (${p.id})`,
                                                                value: p.id
                                                            };
                                                        })
                                                };
                                            })}
                                        closeMenuOnSelect={true}
                                    />
                                </InputGroup>
                                <FormHelperText>
                                    Prints will be added to the end of the queue on the target printer.
                                </FormHelperText>
                            </FormControl>

                            {printers.find((p) => p.id === target)?.type !== originalPrinter.type && (
                                <Alert
                                    status="warning"
                                    borderRadius={5}
                                >
                                    <AlertIcon />
                                    <AlertDescription>
                                        Moving prints to a different printer type is an unlikely action
                                    </AlertDescription>
                                </Alert>
                            )}
                        </VStack>
                    </ModalBody>

                    <ModalFooter gap={3}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => {
                                movePrints(prints, target);
                            }}
                            isDisabled={target === originalPrinter.id}
                            isLoading={isSaving}
                        >
                            Confirm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
