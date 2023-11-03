import { useCallback, useEffect, useState } from 'react';

import {
    Box,
    Button,
    ButtonGroup,
    Code,
    Divider,
    Flex,
    HStack,
    Heading,
    Icon,
    IconButton,
    Spacer,
    Table,
    TableContainer,
    Tag,
    TagLabel,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import useConfirmation from '@/contexts/ConfirmDialogContext';

import useRequest from '@/hooks/useRequest';

import iconSet from '@/util/icons';

import ConfigLayout from '@/layouts/ConfigLayout';
import GlobalLayout from '@/layouts/GlobalLayout';

import PrinterModal from '@/components/config/printers/PrinterModal';
import PrinterTypeModal from '@/components/config/printers/PrinterTypeModal';
import MaintenanceModal from '@/components/printing/maintenance/MaintenanceModal';

export default function Printers(props) {
    const request = useRequest();
    const [printers, setPrinters] = useState(null);
    const [printerTypes, setPrinterTypes] = useState(null);

    const [editingTypeData, setEditingTypeData] = useState(null);
    const [editingPrinterData, setEditingPrinterData] = useState(null);

    const { isOpen: isNewTypeOpen, onClose: onNewTypeClose, onOpen: onNewTypeOpen } = useDisclosure();
    const { isOpen: isNewPrinterOpen, onClose: onNewPrinterClose, onOpen: onNewPrinterOpen } = useDisclosure();
    const { isOpen: isMaintenanceOpen, onClose: onMaintenanceClose, onOpen: onMaintenanceOpen } = useDisclosure();

    const confirm = useConfirmation();

    const refresh = useCallback(() => {
        request('/api/printing/printers')
            .then((data) => {
                setPrinters(data);
            })
            .catch((err) => {});

        request('/api/printing/printerTypes')
            .then((data) => {
                setPrinterTypes(data);
            })
            .catch((err) => {});
    }, [request]);

    const deleteType = useCallback(
        (type) => {
            request(`/api/printing/printerTypes/${type._id}`, {
                method: 'DELETE'
            })
                .then((data) => {
                    refresh();
                })
                .catch((err) => {});
        },
        [refresh, request]
    );

    const deletePrinter = useCallback(
        (printer) => {
            request(`/api/printing/printers/${printer._id}`, {
                method: 'DELETE'
            })
                .then((data) => {
                    refresh();
                })
                .catch((err) => {});
        },
        [refresh, request]
    );

    const initDelete = useCallback(
        (data, isType) => {
            confirm({
                onClose: () => {
                    refresh();
                },
                onConfirm: () => {
                    if (isType) {
                        deleteType(data);
                    } else {
                        deletePrinter(data);
                    }
                },
                header: `Delete ${isType ? data?.displayName + ' type' : data?.displayName + ' printer'}`,
                message: `Are you sure you want to delete ${
                    isType ? data?.displayName : data?.displayName
                }? This action cannot be undone.`,
                confirmButtonText: 'Delete',
                confirmButtonColor: 'red'
            });
        },
        [confirm, deletePrinter, deleteType, refresh]
    );

    const syncQueues = useCallback(() => {
        request('/api/printing/queue/sync', {
            method: 'POST'
        })
            .then((data) => {})
            .catch((err) => {});
    }, [request]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <>
            {/* for some reason this stuff breaks without this conditional render. somthing with the select component */}
            {printers && (
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
                    <MaintenanceModal
                        isOpen={isMaintenanceOpen}
                        onClose={() => {
                            setEditingPrinterData(null);
                            onMaintenanceClose();
                            refresh();
                        }}
                        printerData={editingPrinterData}
                    />
                </>
            )}

            <Box
                w="full"
                h="full"
                overflow="hidden"
            >
                <Flex
                    w="full"
                    h="full"
                    overflow="auto"
                    direction="column"
                    align="center"
                >
                    <VStack
                        spacing={5}
                        h="auto"
                        w="full"
                        align="start"
                        justify="start"
                        maxW="6xl"
                        p={5}
                    >
                        <Heading
                            size="lg"
                            fontFamily="body"
                        >
                            3D Printers
                        </Heading>

                        <HStack>
                            <Button
                                size="lg"
                                onClick={syncQueues}
                            >
                                [DEBUG] Sync queues
                            </Button>
                        </HStack>

                        <VStack
                            spacing={3}
                            align="start"
                            w="full"
                        >
                            <HStack
                                w="full"
                                align="center"
                            >
                                <Text
                                    fontSize="2xl"
                                    fontWeight="semibold"
                                    fontFamily="body"
                                >
                                    Printer types
                                </Text>
                                <Spacer />
                                <ButtonGroup size="sm">
                                    <Button
                                        colorScheme="blue"
                                        leftIcon={<Icon as={iconSet.add} />}
                                        onClick={onNewTypeOpen}
                                    >
                                        Add printer type
                                    </Button>
                                </ButtonGroup>
                            </HStack>

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
                                                    <Text
                                                        fontSize="md"
                                                        fontWeight="medium"
                                                    >
                                                        {type.displayName}
                                                    </Text>
                                                </Td>
                                                <Td>
                                                    <Tag colorScheme={type.color}>
                                                        <TagLabel>{type.id}</TagLabel>
                                                    </Tag>
                                                </Td>
                                                <Td>
                                                    <ButtonGroup size="sm">
                                                        <Button
                                                            leftIcon={<Icon as={iconSet.pencil} />}
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
                                                                initDelete(type, true);
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

                        <Divider />

                        <VStack
                            spacing={3}
                            align="start"
                            w="full"
                        >
                            <HStack
                                w="full"
                                align="center"
                            >
                                <Text
                                    fontSize="2xl"
                                    fontWeight="semibold"
                                    fontFamily="body"
                                >
                                    Printers
                                </Text>
                                <Spacer />
                                <ButtonGroup size="sm">
                                    <Button
                                        colorScheme="blue"
                                        leftIcon={<Icon as={iconSet.add} />}
                                        onClick={onNewPrinterOpen}
                                    >
                                        Add printer
                                    </Button>
                                </ButtonGroup>
                            </HStack>

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
                                                        spacing={2}
                                                        align="start"
                                                    >
                                                        <Text
                                                            fontSize="md"
                                                            fontWeight="medium"
                                                        >
                                                            {printer.displayName}
                                                        </Text>
                                                        <Code fontSize="xs">{printer.id}</Code>
                                                    </VStack>
                                                </Td>
                                                <Td>
                                                    <Tag
                                                        colorScheme={
                                                            printerTypes?.find((t) => t.id === printer.type)?.color
                                                        }
                                                    >
                                                        <TagLabel>{printer.type}</TagLabel>
                                                    </Tag>
                                                </Td>
                                                <Td>
                                                    <ButtonGroup size="sm">
                                                        <Button
                                                            onClick={() => {
                                                                setEditingPrinterData(printer);
                                                                onNewPrinterOpen();
                                                            }}
                                                            leftIcon={<Icon as={iconSet.pencil} />}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <IconButton
                                                            colorScheme="orange"
                                                            onClick={() => {
                                                                setEditingPrinterData(printer);
                                                                onMaintenanceOpen();
                                                            }}
                                                        >
                                                            <Icon as={iconSet.wrench} />
                                                        </IconButton>
                                                        <IconButton
                                                            colorScheme="red"
                                                            onClick={() => {
                                                                initDelete(printer, false);
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
            </Box>
        </>
    );
}

Printers.getLayout = (page) => (
    <GlobalLayout>
        <ConfigLayout>{page}</ConfigLayout>
    </GlobalLayout>
);
