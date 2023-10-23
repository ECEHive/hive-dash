import { useState } from 'react';

import {
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
    VStack
} from '@chakra-ui/react';

import usePrinting from '@/contexts/printing/PrintingContext';

import { Select } from '@/components/Select';

export default function MoveModal({ isOpen, onClose, originalPrinter, callback, prints }) {
    const { printers, printerTypes } = usePrinting();

    const [target, setTarget] = useState(originalPrinter.id);

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
                                        options={printerTypes.map((type) => {
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
                        </VStack>
                    </ModalBody>

                    <ModalFooter gap={3}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => {
                                callback(target, prints);
                            }}
                            isDisabled={target === originalPrinter.id}
                        >
                            Confirm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
