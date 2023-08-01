import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    Avatar,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Icon,
    IconButton,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverTrigger,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useColorModeValue,
    useDisclosure
} from '@chakra-ui/react';

import { Select } from 'chakra-react-select';

import iconSet from '@/util/icons';

function AddMaterialPopover({ children, onAdd }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [name, setName] = useState('');

    return (
        <Popover
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
        >
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                {/* <PopoverHeader>Add material</PopoverHeader> */}
                <PopoverBody p={3}>
                    <FormControl>
                        <FormLabel>Material name</FormLabel>
                        <InputGroup>
                            <Input
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                        </InputGroup>
                    </FormControl>
                </PopoverBody>
                <PopoverFooter
                    display="flex"
                    justifyContent="flex-end"
                >
                    <ButtonGroup size="sm">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setName('');
                                onClose();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => {
                                onAdd(name);
                                setName('');
                                onClose();
                            }}
                        >
                            Add
                        </Button>
                    </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
}

export default function PrinterTypeModal({ isOpen, onClose, initialData }) {
    const tableBorderColor = useColorModeValue('gray.200', 'gray.600');

    const [saving, setSaving] = useState(false);

    const template = useMemo(
        () => ({
            displayName: '',
            color: '',
            id: '',
            description: '',
            materials: [],
            materialUnits: {
                symbol: '',
                type: ''
            }
        }),
        []
    );

    const [data, setData] = useState(template);

    const colors = [
        {
            label: 'red',
            value: useColorModeValue('red.500', 'red.300')
        },
        {
            label: 'orange',
            value: useColorModeValue('orange.500', 'orange.300')
        },
        {
            label: 'yellow',

            value: useColorModeValue('yellow.500', 'yellow.300')
        },
        {
            label: 'green',
            value: useColorModeValue('green.500', 'green.300')
        },
        {
            label: 'teal',
            value: useColorModeValue('teal.500', 'teal.300')
        },
        {
            label: 'blue',
            value: useColorModeValue('blue.500', 'blue.300')
        },
        {
            label: 'cyan',
            value: useColorModeValue('cyan.500', 'cyan.300')
        },
        {
            label: 'purple',
            value: useColorModeValue('purple.500', 'purple.300')
        },
        {
            label: 'pink',
            value: useColorModeValue('pink.500', 'pink.300')
        }
    ];

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
            fetch(`/api/printing/printerTypes/${initialData._id}`, {
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
            fetch('/api/printing/printerTypes/create', {
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
                    <ModalHeader>{initialData ? 'Edit' : 'Add'} printer type</ModalHeader>
                    <ModalBody>
                        <VStack spacing={3}>
                            <HStack
                                spacing={3}
                                w="full"
                                align="start"
                            >
                                <FormControl>
                                    <FormLabel>Type name</FormLabel>
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
                                    <FormLabel>Type ID</FormLabel>
                                    <InputGroup>
                                        <Input
                                            fontFamily="mono"
                                            value={data.id}
                                            onChange={(e) => {
                                                update('id', e.target.value.replace(/\s/g, ''));
                                            }}
                                        />
                                    </InputGroup>
                                    <FormHelperText>Used to link printers to this type.</FormHelperText>
                                </FormControl>
                            </HStack>

                            <FormControl h="auto">
                                <FormLabel>Type color</FormLabel>
                                <Select
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (provided) => ({ ...provided, zIndex: 10000 })
                                    }}
                                    options={colors}
                                    formatOptionLabel={(option) => {
                                        console.log(option);
                                        return (
                                            <>
                                                <HStack spacing={3}>
                                                    <Avatar
                                                        icon={<></>}
                                                        size="2xs"
                                                        bgColor={colors.find((c) => c.value === option.value)?.value}
                                                    />
                                                    <Text>{option.label}</Text>
                                                </HStack>
                                            </>
                                        );
                                    }}
                                    value={{
                                        label: data.color,
                                        value: colors.find((c) => c.label === data.color)?.value
                                    }}
                                    onChange={(e) => {
                                        update('color', e.label);
                                    }}
                                    selectedOptionStyle="check"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Type description</FormLabel>
                                <InputGroup>
                                    <Input
                                        value={data.description}
                                        onChange={(e) => {
                                            update('description', e.target.value);
                                        }}
                                    />
                                </InputGroup>
                                <FormHelperText>
                                    Short description to highlight strengths/use cases for this printer type.
                                </FormHelperText>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Materials</FormLabel>
                                <Card
                                    variant="outline"
                                    bgColor="transparent"
                                    w="full"
                                >
                                    <CardBody>
                                        <VStack
                                            w="full"
                                            align="start"
                                            spacing={3}
                                        >
                                            <AddMaterialPopover
                                                onAdd={(name) => {
                                                    update('materials', [...data.materials, name]);
                                                }}
                                            >
                                                <Button size="sm">Add material</Button>
                                            </AddMaterialPopover>

                                            <TableContainer w="full">
                                                <Table size="sm">
                                                    <Thead>
                                                        <Tr>
                                                            <Th borderColor={tableBorderColor}>Material</Th>
                                                            <Th borderColor={tableBorderColor}>Actions</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {data.materials.map((material, i) => (
                                                            <Tr key={i}>
                                                                <Td borderColor={tableBorderColor}>
                                                                    <Text fontSize="md">{material}</Text>
                                                                </Td>
                                                                <Td borderColor={tableBorderColor}>
                                                                    <ButtonGroup size="sm">
                                                                        <AddMaterialPopover
                                                                            onAdd={(name) => {
                                                                                // rename this material
                                                                                update(
                                                                                    'materials',
                                                                                    data.materials.map((m, j) => {
                                                                                        if (i === j) {
                                                                                            return name;
                                                                                        } else {
                                                                                            return m;
                                                                                        }
                                                                                    })
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                leftIcon={<Icon as={iconSet.pencil} />}
                                                                            >
                                                                                Rename
                                                                            </Button>
                                                                        </AddMaterialPopover>
                                                                        <IconButton
                                                                            colorScheme="red"
                                                                            onClick={() => {
                                                                                update(
                                                                                    'materials',
                                                                                    data.materials.filter(
                                                                                        (_, j) => j !== i
                                                                                    )
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Icon as={iconSet.delete} />
                                                                        </IconButton>
                                                                    </ButtonGroup>
                                                                </Td>
                                                            </Tr>
                                                        ))}
                                                    </Tbody>
                                                </Table>
                                            </TableContainer>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </FormControl>

                            <HStack
                                spacing={3}
                                w="full"
                            >
                                <FormControl>
                                    <FormLabel>Material measurement type</FormLabel>
                                    <Select
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: (provided) => ({ ...provided, zIndex: 10000 })
                                        }}
                                        options={[
                                            { value: 'mass', label: 'Mass' },
                                            { value: 'volume', label: 'Volume' }
                                        ]}
                                        value={{
                                            value: data.materialUnits.type,
                                            label: data.materialUnits.type
                                        }}
                                        onChange={(e) => {
                                            update('materialUnits', {
                                                ...data.materialUnits,
                                                type: e.value
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Material measurement symbol</FormLabel>
                                    <InputGroup>
                                        <Input
                                            value={data.materialUnits.symbol}
                                            onChange={(e) => {
                                                update('materialUnits', {
                                                    ...data.materialUnits,
                                                    symbol: e.target.value
                                                });
                                            }}
                                        />
                                    </InputGroup>
                                </FormControl>
                            </HStack>
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
