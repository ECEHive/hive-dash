import { useCallback, useEffect, useState } from 'react';

import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Center,
    Code,
    Flex,
    HStack,
    Heading,
    Icon,
    IconButton,
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
    useDisclosure
} from '@chakra-ui/react';

import useConfirmation from '@/contexts/ConfirmDialogContext';

import iconSet from '@/util/icons';

import ConfigLayout from '@/layouts/ConfigLayout';
import GlobalLayout from '@/layouts/GlobalLayout';

import PrinterModal from '@/components/config/printers/PrinterModal';
import PrinterTypeModal from '@/components/config/printers/PrinterTypeModal';
import MaintenanceModal from '@/components/printing/maintenance/MaintenanceModal';

export default function Printers(props) {
    const [printers, setPrinters] = useState(null);
    const [printerTypes, setPrinterTypes] = useState(null);

    const [editingTypeData, setEditingTypeData] = useState(null);
    const [editingPrinterData, setEditingPrinterData] = useState(null);

    const { isOpen: isNewTypeOpen, onClose: onNewTypeClose, onOpen: onNewTypeOpen } = useDisclosure();
    const { isOpen: isNewPrinterOpen, onClose: onNewPrinterClose, onOpen: onNewPrinterOpen } = useDisclosure();
    const { isOpen: isMaintenanceOpen, onClose: onMaintenanceClose, onOpen: onMaintenanceOpen } = useDisclosure();

    const confirm = useConfirmation();

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

            <Flex
                w="full"
                h="full"
                p={5}
                overflow="hidden"
                direction="column"
                justify="start"
                align="center"
            >
                <Center
                    w="full"
                    h="auto"
                    overflow="auto"
                >
                    <VStack
                        w="full"
                        maxW="2xl"
                        h="full"
                        spacing={5}
                        align="start"
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
                                                            <Text fontSize="md">{type.displayName}</Text>
                                                        </Td>
                                                        <Td>
                                                            <Code
                                                                fontSize="md"
                                                                colorScheme={type.color}
                                                            >
                                                                {type.id}
                                                            </Code>
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
                                                                spacing={1}
                                                                align="start"
                                                            >
                                                                <Text fontSize="md">{printer.displayName}</Text>
                                                                <Code fontSize="xs">{printer.id}</Code>
                                                            </VStack>
                                                        </Td>
                                                        <Td>
                                                            <Code
                                                                fontSize="md"
                                                                colorScheme={
                                                                    printerTypes?.find((t) => t.id === printer.type)
                                                                        ?.color
                                                                }
                                                            >
                                                                {printer.type}
                                                            </Code>
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
                            </CardBody>
                        </Card>
                    </VStack>
                </Center>

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

Printers.getLayout = (page) => (
    <GlobalLayout>
        <ConfigLayout>{page}</ConfigLayout>
    </GlobalLayout>
);
