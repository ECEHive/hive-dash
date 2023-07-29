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

import NewPIModal from '@/components/config/people/NewPIModal';

const ChakraEditor = chakra(Editor);

export default function WebsiteSettings(props) {
    const [PIs, setPIs] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPI, setEditingPI] = useState(null);

    const { isOpen: isNewPIOpen, onOpen: onNewPIOpen, onClose: onNewPIClose } = useDisclosure();

    const editorTheme = useColorModeValue('vs-light', 'vs-dark');
    const { secondary } = useTextColor();

    const refresh = useCallback(() => {
        fetch('/api/peerInstructors')
            .then((res) => res.json())
            .then((data) => {
                setPIs(data.peerInstructors);
            });
    }, []);

    const save = useCallback(() => {
        setSaving(true);
        fetch('/api/config/website', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(PIs)
        })
            .then((res) => res.json())
            .then((data) => {
                refresh();
            })
            .finally(() => {
                setSaving(false);
            });
    }, [PIs, refresh]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <>
            <NewPIModal
                isOpen={isNewPIOpen}
                onClose={onNewPIClose}
                save={(name, email, role) => {
                    setPIs((old) => [
                        ...old,
                        {
                            name: name,
                            email: email,
                            type: role
                        }
                    ]);
                    onNewPIClose();
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
                                    <Button leftIcon={<Icon as={iconSet.people} />}>Batch add PIs</Button>
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
                                                                    setEditingPI(pi.email);
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <IconButton colorScheme="red">
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

                        <Card
                            variant="outline"
                            w="50%"
                            h="full"
                            overflow="hidden"
                        >
                            <CardBody>
                                {editingPI && (
                                    <>
                                        <Heading
                                            size="md"
                                            fontFamily="body"
                                        >
                                            Edit PI
                                        </Heading>
                                        <VStack
                                            mt={5}
                                            w="full"
                                            h="full"
                                            align="start"
                                            spacing={3}
                                        >
                                            <FormControl>
                                                <FormLabel>Peer instructor name</FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        value={PIs.find((pi) => pi.email === editingPI).name}
                                                        onChange={(e) => {
                                                            setPIs((old) => {
                                                                const newPIs = [...old];
                                                                newPIs.find((pi) => pi.email === editingPI).name =
                                                                    e.target.value;
                                                                return newPIs;
                                                            });
                                                        }}
                                                    />
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Peer instructor email</FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        value={PIs.find((pi) => pi.email === editingPI).email}
                                                        onChange={(e) => {
                                                            setPIs((old) => {
                                                                const newPIs = [...old];
                                                                newPIs.find((pi) => pi.email === editingPI).email =
                                                                    e.target.value;
                                                                return newPIs;
                                                            });
                                                        }}
                                                    />
                                                    <InputRightAddon>@gatech.edu</InputRightAddon>
                                                </InputGroup>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Role</FormLabel>
                                                <Select
                                                    value={{
                                                        label: Object.keys(PITypes).find(
                                                            (key) =>
                                                                PITypes[key] ===
                                                                PIs.find((pi) => pi.email === editingPI).type
                                                        ),
                                                        value: PIs.find((pi) => pi.email === editingPI).type
                                                    }}
                                                    options={Object.keys(PITypes).map((key) => ({
                                                        label: key,
                                                        value: PITypes[key]
                                                    }))}
                                                    onChange={(e) => {
                                                        setPIs((old) => {
                                                            const newPIs = [...old];
                                                            newPIs.find((pi) => pi.email === editingPI).type = e.value;
                                                            return newPIs;
                                                        });
                                                    }}
                                                />
                                            </FormControl>
                                        </VStack>
                                    </>
                                )}
                            </CardBody>
                        </Card>
                    </HStack>
                </VStack>
                <HStack
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
                </HStack>
            </Flex>
        </>
    );
}

WebsiteSettings.getLayout = (page) => <ConfigLayout>{page}</ConfigLayout>;
