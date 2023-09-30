import { useCallback, useEffect, useState } from 'react';

import {
    Badge,
    Button,
    ButtonGroup,
    Divider,
    Flex,
    HStack,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    Spacer,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useDisclosure,
    useToast
} from '@chakra-ui/react';

import dayjs from '@/lib/time';

import useRequest from '@/hooks/useRequest';

import iconSet from '@/util/icons';
import { PITypes } from '@/util/roles';

import ConfigLayout from '@/layouts/ConfigLayout';
import GlobalLayout from '@/layouts/GlobalLayout';

import BuzzCardRegisterModal from '@/components/config/people/BuzzCardRegisterModal';

export default function People(props) {
    const request = useRequest();

    const [PIs, setPIs] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastUpdated, setLastUpdated] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);

    const [filteredPIs, setFilteredPIs] = useState(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState(null);

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
        setIsSyncing(true);
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
            .catch((err) => {})
            .finally(() => {
                setIsSyncing(false);
            });
    }, [refresh, toast, request]);

    function disconnectBuzzCard(pi) {
        request('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid: pi.uid,
                mongoId: pi._id
            })
        })
            .then(() => {
                refresh();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            {selectedUser && (
                <BuzzCardRegisterModal
                    isOpen={isOpen}
                    onClose={() => {
                        onClose();
                        setTimeout(() => {
                            refresh();
                            setSelectedUser(null);
                        }, 1000);
                    }}
                    user={selectedUser}
                />
            )}
            <Flex
                h="full"
                w="full"
                overflowY="hidden"
                p={5}
                dir="row"
                justify="center"
                overflowX="auto"
            >
                <VStack
                    position="relative"
                    w="full"
                    h="full"
                    maxW="4xl"
                    justify="center"
                    align="start"
                    spacing={3}
                    px={1}
                    overflowY="hidden"
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
                    >
                        <VStack
                            align="start"
                            w="full"
                        >
                            <VStack
                                spacing={0}
                                align="start"
                            >
                                <Text fontSize="lg">Peer instructors are synced through The HIVE&apos;s Airtable</Text>
                            </VStack>

                            <HStack w="full">
                                <Button
                                    size="sm"
                                    leftIcon={<Icon as={iconSet.refresh} />}
                                    onClick={sync}
                                    colorScheme="blue"
                                    isLoading={isSyncing}
                                >
                                    Sync PIs
                                </Button>
                                <Icon as={iconSet.dot} />
                                <Text
                                    color="secondaryText"
                                    fontSize="sm"
                                >
                                    Last synced: {lastUpdated}
                                </Text>

                                <Spacer />

                                <InputGroup w="auto">
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
                            </HStack>
                        </VStack>

                        <Divider />

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
                                            <Th>Actions</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredPIs.map((pi, i) => (
                                            <Tr key={pi.name}>
                                                <Td>
                                                    <HStack>
                                                        {pi?.uid?.length > 0 && <Icon as={iconSet.buzzCard} />}
                                                        <Text fontSize="md">{pi.name}</Text>
                                                    </HStack>
                                                </Td>
                                                <Td>
                                                    <Badge
                                                        fontSize="xs"
                                                        colorScheme="yellow"
                                                    >
                                                        {Object.keys(PITypes).find((key) => PITypes[key] === pi.type)}
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <Text fontSize="md">{pi.email}</Text>
                                                </Td>
                                                <Td>
                                                    <ButtonGroup
                                                        size="sm"
                                                        dir="row"
                                                    >
                                                        {!pi?.uid ? (
                                                            <Button
                                                                leftIcon={<Icon as={iconSet.buzzCard} />}
                                                                onClick={() => {
                                                                    setSelectedUser(pi);
                                                                    onOpen();
                                                                }}
                                                            >
                                                                Register BuzzCard
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                colorScheme="red"
                                                                leftIcon={<Icon as={iconSet.minus} />}
                                                                onClick={() => {
                                                                    disconnectBuzzCard(pi);
                                                                }}
                                                            >
                                                                Disconnect BuzzCard
                                                            </Button>
                                                        )}
                                                    </ButtonGroup>
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
