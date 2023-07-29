import { useCallback, useEffect, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Badge,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Center,
    Code,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputLeftElement,
    InputRightAddon,
    Spacer,
    Switch,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
    VStack,
    chakra,
    useColorModeValue,
    useDisclosure
} from '@chakra-ui/react';

import Editor from '@monaco-editor/react';
import { Select } from 'chakra-react-select';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';

import useTextColor from '@/hooks/useTextColor';

import iconSet from '@/util/icons';
import { PITypes } from '@/util/roles';

import ConfigLayout from '@/layouts/config/ConfigLayout';

import DeleteDialog from '@/components/DeleteDIalog';
import BatchAddModal from '@/components/config/people/BatchAddModal';
import NewPIModal from '@/components/config/people/NewPIModal';

const ChakraEditor = chakra(Editor);

function PIEditor({ initialData, refresh }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState(null);
    const [email, setEmail] = useState('');

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setRole(initialData.type);
            setEmail(initialData.email);
        }
    }, [initialData]);

    const save = useCallback(() => {
        setSaving(true);
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
                refresh();
                setSaving(false);
            });
    }, [name, role, email]);

    return (
        <Card
            variant="outline"
            w="50%"
            h="full"
            overflow="hidden"
        >
            <CardBody overflow="hidden">
                {initialData && (
                    <>
                        <VStack
                            spacing={5}
                            w="full"
                            h="full"
                            align="start"
                        >
                            <Heading
                                size="md"
                                fontFamily="body"
                            >
                                Edit PI
                            </Heading>
                            <VStack
                                w="full"
                                h="auto"
                                flexGrow={1}
                                align="start"
                                spacing={3}
                                overflow="auto"
                                px={1}
                            >
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <InputGroup>
                                        <Input
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                            }}
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <InputGroup>
                                        <Input
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                            }}
                                        />
                                        <InputRightAddon>@gatech.edu</InputRightAddon>
                                    </InputGroup>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        menuPortalTarget={document.body}
                                        styles={{
                                            menuPortal: (provided) => ({ ...provided, zIndex: 10000 })
                                        }}
                                        value={{
                                            label: Object.keys(PITypes).find((key) => PITypes[key] === role),
                                            value: role
                                        }}
                                        options={Object.keys(PITypes).map((key) => ({
                                            label: key,
                                            value: PITypes[key]
                                        }))}
                                        onChange={(e) => {
                                            setRole(e.value);
                                        }}
                                    />
                                </FormControl>
                            </VStack>

                            <HStack>
                                <ButtonGroup>
                                    <Button
                                        colorScheme="blue"
                                        isLoading={saving}
                                        leftIcon={<Icon as={iconSet.save} />}
                                        onClick={save}
                                    >
                                        Save
                                    </Button>
                                </ButtonGroup>
                            </HStack>
                        </VStack>
                    </>
                )}
            </CardBody>
        </Card>
    );
}

export default function People(props) {
    const [PIs, setPIs] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPI, setEditingPI] = useState(null);

    const { isOpen: isNewPIOpen, onOpen: onNewPIOpen, onClose: onNewPIClose } = useDisclosure();
    const { isOpen: isBatchAddOpen, onOpen: onBatchAddOpen, onClose: onBatchAddClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const { secondary } = useTextColor();

    const refresh = useCallback(() => {
        fetch('/api/peerInstructors')
            .then((res) => res.json())
            .then((data) => {
                setPIs(data.peerInstructors);
            });
    }, []);

    const deletePI = useCallback(
        (entry) => {
            fetch(`/api/peerInstructors/${entry._id}`, {
                method: 'DELETE'
            })
                .then((res) => res.json())
                .then((data) => {
                    refresh();
                });
        },
        [refresh]
    );

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <>
            <DeleteDialog
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onDelete={() => {
                    deletePI(editingPI);
                    onDeleteClose();
                }}
                header="Delete PI"
                message={`Are you sure you want to delete ${editingPI?.name}? This action cannot be undone.`}
            />
            <BatchAddModal
                isOpen={isBatchAddOpen}
                onClose={() => {
                    onBatchAddClose();
                    refresh();
                }}
            />

            <NewPIModal
                isOpen={isNewPIOpen}
                onClose={() => {
                    onNewPIClose();
                    refresh();
                }}
            />
            <Flex
                w="full"
                h="full"
                p={5}
                overflow="hidden"
                direction="column"
                justify="center"
                align="center"
            >
                <VStack
                    w="full"
                    maxW="6xl"
                    h="full"
                    spacing={3}
                    align="start"
                    overflow="hidden"
                >
                    <Heading
                        size="lg"
                        fontFamily="body"
                    >
                        Peer Instructors
                    </Heading>

                    {/* editor stuff */}
                    <HStack
                        w="full"
                        h="full"
                        align="start"
                        justify="start"
                        spacing={5}
                        overflow="hidden"
                        p={1}
                    >
                        <VStack
                            w="50%"
                            h="full"
                            align="start"
                            spacing={3}
                        >
                            <VStack
                                w="auto"
                                h="auto"
                                align="start"
                            >
                                <InputGroup>
                                    <InputLeftElement>
                                        <Icon as={iconSet.search} />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="Search for a PI"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value.toLowerCase());
                                        }}
                                    />
                                </InputGroup>
                                <ButtonGroup>
                                    <Button
                                        leftIcon={<Icon as={iconSet.personPlus} />}
                                        onClick={onNewPIOpen}
                                    >
                                        Add PI
                                    </Button>
                                    <Button
                                        leftIcon={<Icon as={iconSet.people} />}
                                        onClick={onBatchAddOpen}
                                    >
                                        Batch add PIs
                                    </Button>
                                </ButtonGroup>
                            </VStack>
                            {PIs && (
                                <TableContainer
                                    w="full"
                                    h="auto"
                                    overflow="scroll"
                                >
                                    <Table size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th>Peer instructor</Th>
                                                <Th>Actions</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {PIs.map((pi, i) => (
                                                <Tr key={i}>
                                                    <Td>
                                                        <HStack>
                                                            <Text fontSize="md">{pi.name}</Text>
                                                            <Badge
                                                                fontSize="xs"
                                                                colorScheme="blue"
                                                            >
                                                                {Object.keys(PITypes).find(
                                                                    (key) => PITypes[key] === pi.type
                                                                )}
                                                            </Badge>
                                                        </HStack>
                                                    </Td>
                                                    <Td>
                                                        <ButtonGroup size="sm">
                                                            <Button
                                                                leftIcon={<Icon as={iconSet.pencil} />}
                                                                onClick={() => {
                                                                    setEditingPI(pi);
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <IconButton
                                                                colorScheme="red"
                                                                onClick={() => {
                                                                    setEditingPI(pi);
                                                                    onDeleteOpen();
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
                            )}
                        </VStack>

                        <PIEditor
                            initialData={editingPI}
                            refresh={refresh}
                        />
                    </HStack>
                </VStack>

                {/* <HStack
                    w="full"
                    h="auto"
                    justify="cetner"
                >
                    <ButtonGroup w="auto">
                        <Button
                            colorScheme="blue"
                            isLoading={null}
                            leftIcon={<Icon as={iconSet.save} />}
                            onClick={null}
                        >
                            Save
                        </Button>
                    </ButtonGroup>
                </HStack> */}
            </Flex>
        </>
    );
}

People.getLayout = (page) => <ConfigLayout>{page}</ConfigLayout>;
