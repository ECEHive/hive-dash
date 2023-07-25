import { useEffect, useState } from 'react';

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
    Textarea,
    VStack
} from '@chakra-ui/react';

export default function UpdateModal({ isOpen, onClose, eventData, save }) {
    const [event, setEvent] = useState(eventData);

    useEffect(() => {
        setEvent(eventData);
    }, [eventData]);

    return (
        <>
            {event && (
                <Modal
                    isOpen={isOpen}
                    isCentered
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Print {event.type}</ModalHeader>

                        <ModalBody>
                            <VStack>
                                <FormControl>
                                    <FormLabel>Event notes (optional)</FormLabel>
                                    <InputGroup>
                                        <Textarea
                                            resize="none"
                                            placeholder="print felled over :("
                                            value={event.notes}
                                            onChange={(e) => setEvent({ ...event, notes: e.target.value })}
                                        />
                                    </InputGroup>
                                    <FormHelperText>Notes about the print event. Markdown is supported.</FormHelperText>
                                </FormControl>
                            </VStack>
                        </ModalBody>

                        <ModalFooter gap={3}>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button
                                colorScheme="blue"
                                onClick={() => {
                                    save(event);
                                }}
                            >
                                Confirm
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}
