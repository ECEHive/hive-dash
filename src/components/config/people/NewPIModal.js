import { useCallback, useState } from 'react';

import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    VStack
} from '@chakra-ui/react';

import { Select } from 'chakra-react-select';

import { PITypes } from '@/util/roles';

export default function NewPIModal({ isOpen, onClose }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState('');

    const submit = useCallback(() => {
        fetch('/api/peerInstructors/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                type: role,
                email: email
            })
        })
            .then((res) => res.json())
            .then((data) => {
                onClose();
            });
    }, [name, role, email, onClose]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add a PI</ModalHeader>
                    <ModalBody>
                        <VStack>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <InputGroup>
                                    <Input
                                        resize="none"
                                        placeholder="firstname lastname"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>GT email</FormLabel>
                                <InputGroup>
                                    <Input
                                        resize="none"
                                        placeholder="chartigan6"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <InputRightAddon>@gatech.edu</InputRightAddon>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Role</FormLabel>
                                <Select
                                    options={Object.keys(PITypes).map((key) => ({
                                        label: key,
                                        value: PITypes[key]
                                    }))}
                                    value={{
                                        value: role,
                                        label: Object.keys(PITypes).find((key) => PITypes[key] === role)
                                    }}
                                    onChange={(e) => setRole(e.value)}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter gap={3}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            colorScheme="blue"
                            onClick={submit}
                        >
                            Confirm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
