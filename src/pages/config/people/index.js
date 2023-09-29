import { useCallback, useEffect, useState } from 'react';

import {
    Badge,
    Button,
    Divider,
    Flex,
    HStack,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useToast
} from '@chakra-ui/react';

import dayjs from '@/lib/time';

import useRequest from '@/hooks/useRequest';

import iconSet from '@/util/icons';
import { PITypes } from '@/util/roles';

import ConfigLayout from '@/layouts/ConfigLayout';
import GlobalLayout from '@/layouts/GlobalLayout';

export default function People(props) {
    const request = useRequest();

    const [PIs, setPIs] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastUpdated, setLastUpdated] = useState('');

    const [filteredPIs, setFilteredPIs] = useState(null);

    const toast = useToast();

    const refresh = useCallback(() => {
        request('/api/peerInstructors')
            .then((data) => {
                setPIs(data.peerInstructors.sort((a, b) => a.name.localeCompare(b.name)));
            })
            .catch((err) => {});

        request('/api/config/people')
            .then((data) => {
                console.log(data);
                setLastUpdated(dayjs(data.config.lastUpdated).local().format('MMMM D, YYYY [at] h:mm A'));
            })
            .catch((err) => {});
    }, [request]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        if (searchTerm.length > 0) {
            setFilteredPIs(PIs.filter((pi) => pi.name.toLowerCase().includes(searchTerm)));
        } else {
            setFilteredPIs(PIs);
        }
    }, [searchTerm, PIs]);

    const sync = useCallback(() => {
        request('/api/peerInstructors/sync', {
            method: 'POST'
        })
            .then((data) => {
                toast({
                    title: 'Synced peer instructors',
                    status: 'success',
                    duration: 5000
                });
                refresh();
            })
            .catch((err) => {});
    }, [refresh, toast, request]);

    return (
        <>
            <Flex
                w="full"
                h="full"
                p={5}
                overflow="hidden"
                direction="column"
                justify="start"
                align="center"
            >
                <VStack
                    w="full"
                    maxW="2xl"
                    maxH="full"
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
                    <VStack
                        w="full"
                        h="full"
                        align="start"
                        spacing={3}
                        overflow="hidden"
                        px={1}
                    >
                        <VStack align="start">
                            <VStack
                                spacing={0}
                                align="start"
                            >
                                <Text fontSize="lg">Peer instructors are synced through The HIVE&apos;s Airtable</Text>
                            </VStack>

                            <HStack>
                                <Button
                                    leftIcon={<Icon as={iconSet.refresh} />}
                                    onClick={sync}
                                >
                                    Sync PIs
                                </Button>
                                <Text color="secondaryText">Last synced: {lastUpdated}</Text>
                            </HStack>
                        </VStack>

                        <Divider />

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
                        </VStack>

                        {filteredPIs && (
                            <TableContainer
                                w="full"
                                h="auto"
                                flexGrow={1}
                                overflowY="auto"
                                pr={1}
                            >
                                <Table
                                    h="auto"
                                    size="md"
                                >
                                    <Thead>
                                        <Tr>
                                            <Th>Peer instructor</Th>
                                            <Th>Role</Th>
                                            <Th>Email</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredPIs.map((pi, i) => (
                                            <Tr key={pi.name}>
                                                <Td>
                                                    <Text fontSize="md">{pi.name}</Text>
                                                </Td>
                                                <Td>
                                                    <Badge
                                                        fontSize="xs"
                                                        colorScheme="blue"
                                                    >
                                                        {Object.keys(PITypes).find((key) => PITypes[key] === pi.type)}
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <Text fontSize="md">{pi.email}...</Text>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        )}
                    </VStack>
                </VStack>
            </Flex>
        </>
    );
}

People.getLayout = (page) => (
    <GlobalLayout>
        <ConfigLayout>{page}</ConfigLayout>
    </GlobalLayout>
);
