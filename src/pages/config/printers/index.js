import { useCallback, useEffect, useState } from 'react';

import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Code,
    Flex,
    Heading,
    Icon,
    IconButton,
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

import ConfigLayout from '@/layouts/config/ConfigLayout';

import DeleteDialog from '@/components/DeleteDIalog';
import PrinterModal from '@/components/config/printers/PrinterModal';
import PrinterTypeModal from '@/components/config/printers/PrinterTypeModal';

export default function People(props) {
    const [printers, setPrinters] = useState(null);
    const [printerTypes, setPrinterTypes] = useState(null);

    const [editingTypeData, setEditingTypeData] = useState(null);
    const [editingPrinterData, setEditingPrinterData] = useState(null);

    const { isOpen: isNewTypeOpen, onClose: onNewTypeClose, onOpen: onNewTypeOpen } = useDisclosure();
    const { isOpen: isNewPrinterOpen, onClose: onNewPrinterClose, onOpen: onNewPrinterOpen } = useDisclosure();
    const { isOpen: isDeleteOpen, onClose: onDeleteClose, onOpen: onDeleteOpen } = useDisclosure();

    const refresh = useCallback(() => {
        fetch('/api/printing/printers')
            .then((res) => res.json())
            .then((data) => {
                setPrinters(data);
            });

        fetch('/api/printing/printerTypes')
            .then((res) => res.json())
            .then((data) => {
                setPrinterTypes(data);
            });
    }, []);

    const deleteType = useCallback(
        (type) => {
            fetch(`/api/printing/printerTypes/${type._id}`, {
                method: 'DELETE'
            })
                .then((res) => res.json())
                .then((data) => {
                    refresh();
                });
        },
        [refresh]
    );

    const deletePrinter = useCallback(
        (printer) => {
            fetch(`/api/printing/printers/${printer._id}`, {
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
            <PrinterTypeModal
                isOpen={isNewTypeOpen}
                onClose={() => {
                    setEditingTypeData(null);
                    onNewTypeClose();
                    refresh();
                }}
                initialData={editingTypeData}
            />
            <PrinterModal
                isOpen={isNewPrinterOpen}
                onClose={() => {
                    setEditingPrinterData(null);
                    onNewPrinterClose();
                    refresh();
                }}
                printerTypes={printerTypes}
                initialData={editingPrinterData}
            />
            <DeleteDialog
                isOpen={isDeleteOpen}
                onClose={() => {
                    setEditingPrinterData(null);
                    setEditingTypeData(null);
                    onDeleteClose();
                }}
                onDelete={() => {
                    if (editingTypeData) {
                        deleteType(editingTypeData);
                    } else if (editingPrinterData) {
                        deletePrinter(editingPrinterData);
                    }
                    onDeleteClose();
                }}
                header={`Delete ${
                    editingTypeData
                        ? editingTypeData?.displayName + ' type'
                        : editingPrinterData?.displayName + ' printer'
                }`}
                message={`Are you sure you want to delete ${
                    editingTypeData ? editingTypeData?.displayName : editingPrinterData?.displayName
                }? This action cannot be undone.`}
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
                    spacing={5}
                    align="start"
                    overflow="hidden"
                    px={1}
                >
                    <Heading
                        size="lg"
                        fontFamily="body"
                    >
                        3D Printers
                    </Heading>

                    <Card
                        variant="outline"
                        w="full"
                    >
                        <CardBody p={0}>
                            <VStack
                                spacing={3}
                                align="start"
                                w="full"
                                p={5}
                            >
                                <Text
                                    fontSize="2xl"
                                    fontWeight="semibold"
                                    fontFamily="body"
                                >
                                    Printer types
                                </Text>

                                <ButtonGroup>
                                    <Button
                                        leftIcon={<Icon as={iconSet.add} />}
                                        onClick={onNewTypeOpen}
                                    >
                                        Add printer type
                                    </Button>
                                </ButtonGroup>

                                <TableContainer w="full">
                                    <Table
                                        w="full"
                                        size="sm"
                                    >
                                        <Thead>
                                            <Tr>
                                                <Th>Type Name</Th>
                                                <Th>Type ID</Th>
                                                <Th>Actions</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {printerTypes?.map((type) => (
                                                <Tr key={type.id}>
                                                    <Td>
                                                        <Text fontSize="md">{type.displayName}</Text>
                                                    </Td>
                                                    <Td>
                                                        <Code fontSize="md">{type.id}</Code>
                                                    </Td>
                                                    <Td>
                                                        <ButtonGroup size="sm">
                                                            <Button
                                                                onClick={() => {
                                                                    setEditingTypeData(type);
                                                                    onNewTypeOpen();
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <IconButton
                                                                colorScheme="red"
                                                                onClick={() => {
                                                                    setEditingTypeData(type);
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
                            </VStack>
                        </CardBody>
                    </Card>

                    <Card
                        variant="outline"
                        w="full"
                    >
                        <CardBody p={0}>
                            <VStack
                                spacing={3}
                                align="start"
                                w="full"
                                p={5}
                            >
                                <Text
                                    fontSize="2xl"
                                    fontWeight="semibold"
                                    fontFamily="body"
                                >
                                    Printers
                                </Text>

                                <ButtonGroup>
                                    <Button
                                        leftIcon={<Icon as={iconSet.add} />}
                                        onClick={onNewPrinterOpen}
                                    >
                                        Add printer
                                    </Button>
                                </ButtonGroup>

                                <TableContainer w="full">
                                    <Table
                                        w="full"
                                        size="sm"
                                    >
                                        <Thead>
                                            <Tr>
                                                <Th>Printer Name</Th>
                                                <Th>Type</Th>
                                                <Th>Actions</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {printers?.map((printer) => (
                                                <Tr key={printer.id}>
                                                    <Td>
                                                        <VStack
                                                            spacing={1}
                                                            align="start"
                                                        >
                                                            <Text fontSize="md">{printer.displayName}</Text>
                                                            <Code fontSize="xs">{printer.id}</Code>
                                                        </VStack>
                                                    </Td>
                                                    <Td>
                                                        <Code fontSize="md">{printer.type}</Code>
                                                    </Td>
                                                    <Td>
                                                        <ButtonGroup size="sm">
                                                            <Button
                                                                onClick={() => {
                                                                    setEditingPrinterData(printer);
                                                                    onNewPrinterOpen();
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <IconButton
                                                                colorScheme="red"
                                                                onClick={() => {
                                                                    setEditingPrinterData(printer);
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
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>

                {/* <HStack
                    w="full"
                    h="auto"
                    justify="end"
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
