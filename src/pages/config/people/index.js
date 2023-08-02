import { useCallback, useEffect, useState } from 'react';

import {
    Badge,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    Heading,
    Icon,
    IconButton,
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
    useDisclosure
} from '@chakra-ui/react';

import iconSet from '@/util/icons';
import { PITypes } from '@/util/roles';

import ConfigLayout from '@/layouts/config/ConfigLayout';

import ConfirmDialog from '@/components/ConfirmDialog';
import BatchAddModal from '@/components/config/people/BatchAddModal';
import NewPIModal from '@/components/config/people/NewPIModal';

export default function People(props) {
    const [PIs, setPIs] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPI, setEditingPI] = useState(null);

    const [filteredPIs, setFilteredPIs] = useState(null);

    const { isOpen: isNewPIOpen, onOpen: onNewPIOpen, onClose: onNewPIClose } = useDisclosure();
    const { isOpen: isBatchAddOpen, onOpen: onBatchAddOpen, onClose: onBatchAddClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

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

    useEffect(() => {
        if (searchTerm.length > 0) {
            setFilteredPIs(PIs.filter((pi) => pi.name.toLowerCase().includes(searchTerm)));
        } else {
            setFilteredPIs(PIs);
        }
    }, [searchTerm, PIs]);

    return (
        <>
            <ConfirmDialog
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
                initialData={editingPI}
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
                    maxW="2xl"
                    h="full"
                    spacing={3}
                    align="start"
                    overflow="hidden"
                    px={1}
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
                                    onClick={() => {
                                        setEditingPI(null);
                                        onNewPIOpen();
                                    }}
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
                        {filteredPIs && (
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
                                        {filteredPIs.map((pi, i) => (
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
                                                                onNewPIOpen();
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
                </VStack>
            </Flex>
        </>
    );
}

People.getLayout = (page) => <ConfigLayout>{page}</ConfigLayout>;
