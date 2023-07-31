import { useCallback, useEffect, useState } from 'react';

import {
    Button,
    FormControl,
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
    VStack
} from '@chakra-ui/react';

import { Select } from 'chakra-react-select';

import { PITypes } from '@/util/roles';

export default function NewPIModal({ isOpen, onClose, initialData }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState('');

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setRole(initialData.type);
            setEmail(initialData.email);
        } else {
            setName('');
            setRole(null);
            setEmail('');
        }
    }, [initialData]);

    const submit = useCallback(() => {
        setSaving(true);
        if (!initialData) {
            fetch('/api/peerInstructors/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'single',
                    data: {
                        name: name,
                        type: role,
                        email: email
                    }
                })
            })
                .then((res) => res.json())
                .then((data) => {
                    onClose();
                    setSaving(false);
                });
        } else {
            fetch(`/api/peerInstructors/${initialData._id}`, {
                method: 'PUT',
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
                    setSaving(false);
                });
        }
    }, [name, role, email, onClose, initialData]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                isCentered
                size="lg"
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
                            isLoading={saving}
                        >
                            Confirm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
