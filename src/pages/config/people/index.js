import { useCallback, useEffect, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    ButtonGroup,
    Center,
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
    useColorModeValue
} from '@chakra-ui/react';

import Editor from '@monaco-editor/react';
import { Select } from 'chakra-react-select';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';

import useTextColor from '@/hooks/useTextColor';

import iconSet from '@/util/icons';
import { PITypes } from '@/util/roles';

import ConfigLayout from '@/layouts/config/ConfigLayout';

const ChakraEditor = chakra(Editor);

export default function WebsiteSettings(props) {
    const [PIs, setPIs] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
        <Box
            w="full"
            h="full"
            p={5}
            overflow="hidden"
        >
            <Center
                minW="full"
                h="full"
                overflow="auto"
            >
                <VStack
                    w="xl"
                    h="full"
                    spacing={5}
                    align="start"
                >
                    <Heading
                        size="lg"
                        fontFamily="body"
                    >
                        Peer Instructors
                    </Heading>

                    <VStack
                        w="full"
                        maxH="500px"
                        align="start"
                        spacing={3}
                    >
                        <HStack w="auto">
                            <InputGroup maxW="70%">
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
                            <Button leftIcon={<Icon as={iconSet.add} />}>Add PI</Button>
                        </HStack>
                        {PIs && (
                            <TableContainer w="full">
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
                                                    <VStack
                                                        align="start"
                                                        spacing={0.5}
                                                    >
                                                        <Text fontSize="md">{pi.name}</Text>
                                                        <Text
                                                            fontSize="xs"
                                                            color={secondary}
                                                        >
                                                            ROLES.
                                                            {Object.keys(PITypes).find(
                                                                (key) => PITypes[key] === pi.type
                                                            )}
                                                        </Text>
                                                    </VStack>
                                                </Td>
                                                <Td>
                                                    <ButtonGroup size="sm">
                                                        <Button leftIcon={<Icon as={iconSet.pencil} />}>Edit</Button>
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

                    <FormControl>
                        <FormLabel>Manually edit PI database</FormLabel>
                        {PIs && (
                            <ChakraEditor
                                height="500px"
                                defaultLanguage="json"
                                defaultValue={JSON.stringify(PIs, null, 4)}
                                onChange={(value) => {
                                    setPIs(JSON.parse(value));
                                }}
                                options={{
                                    minimap: {
                                        enabled: true
                                    }
                                }}
                                theme={editorTheme}
                            />
                        )}
                    </FormControl>
                </VStack>
            </Center>
        </Box>
    );
}

WebsiteSettings.getLayout = (page) => <ConfigLayout>{page}</ConfigLayout>;
