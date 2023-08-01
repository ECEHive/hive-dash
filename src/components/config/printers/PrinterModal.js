import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack
} from '@chakra-ui/react';

import { Select } from 'chakra-react-select';

import dayjs from '@/lib/time';

export default function PrinterModal({ isOpen, onClose, initialData, printerTypes }) {
    const [saving, setSaving] = useState(false);

    const template = useMemo(
        () => ({
            displayName: '',
            id: '',
            type: '',
            enabled: true,
            maintenance: {
                notes: ''
            },
            updatedAt: dayjs().toISOString(),
            currentTray: ''
        }),
        []
    );

    const [data, setData] = useState(template);

    const update = useCallback((field, value) => {
        setData((old) => {
            return {
                ...old,
                [field]: value
            };
        });
    }, []);

    useEffect(() => {
        if (initialData) {
            setData(initialData);
        } else {
            setData(template);
        }
    }, [initialData, template]);

    const submit = useCallback(() => {
        setSaving(true);

        if (initialData) {
            fetch(`/api/printing/printers/${initialData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((res) => res.json())
                .then((data) => {
                    onClose();
                    setSaving(false);
                });
        } else {
            fetch('/api/printing/printers/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((res) => res.json())
                .then((data) => {
                    onClose();
                    setSaving(false);
                });
        }
    }, [data, initialData, onClose]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                isCentered
                size="xl"
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{initialData ? 'Edit' : 'Add'} printer</ModalHeader>
                    <ModalBody>
                        <VStack spacing={3}>
                            <FormControl>
                                <FormLabel>Printer Name</FormLabel>
                                <InputGroup>
                                    <Input
                                        value={data.displayName}
                                        onChange={(e) => {
                                            update('displayName', e.target.value);
                                        }}
                                    />
                                </InputGroup>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Printer ID</FormLabel>
                                <InputGroup>
                                    <Input
                                        fontFamily="mono"
                                        value={data.id}
                                        onChange={(e) => {
                                            update('id', e.target.value.replace(/\s/g, ''));
                                        }}
                                    />
                                </InputGroup>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Printer Type</FormLabel>
                                <Select
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (provided) => ({ ...provided, zIndex: 10000 })
                                    }}
                                    value={{
                                        value: data.type,
                                        label: data.type
                                    }}
                                    options={printerTypes?.map((type) => {
                                        return {
                                            value: type.id,
                                            label: type.displayName
                                        };
                                    })}
                                    onChange={(e) => {
                                        update('type', e.value);
                                    }}
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
