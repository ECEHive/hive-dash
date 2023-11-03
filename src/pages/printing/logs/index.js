import { useMemo } from 'react';

import {
    Box,
    CircularProgress,
    Divider,
    Flex,
    HStack,
    Heading,
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
    VStack
} from '@chakra-ui/react';

import Link from 'next/link';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintEvents from '@/hooks/printing/usePrintEvents';
import usePrintProgress from '@/hooks/printing/usePrintProgress';

import { PrintStates } from '@/util/states';

import GlobalLayout from '@/layouts/GlobalLayout';
import Layout from '@/layouts/PrintingLayout';

function PrinterTag({ printer, printerType }) {
    return (
        <Tag
            colorScheme={printerType.color}
            as={Link}
            href={`/printing/printers/${printer.id}`}
        >
            <TagLabel>{printer.displayName}</TagLabel>
        </Tag>
    );
}

function PrintingItem({ print, printer, printerType }) {
    const {
        startTime,
        progress,
        timeLeft,
        progressBarColor,
        progressMessage,
        timeLeftHumanizedDetailed,
        progressCircleColor
    } = usePrintProgress(print);

    return (
        <Tr>
            <Td>
                <HStack>
                    <VStack align="start">
                        <Text
                            fontWeight="semibold"
                            fontSize="lg"
                            as={Link}
                            href={`/printing/prints/${print._id}`}
                        >
                            {print.trayName}
                        </Text>

                        <PrinterTag
                            printer={printer}
                            printerType={printerType}
                        />
                    </VStack>
                </HStack>
            </Td>
            <Td>
                <HStack>
                    <CircularProgress
                        size={8}
                        thickness={8}
                        value={progress}
                        color={progressCircleColor}
                        trackColor="progressTrackAlt"
                    />
                    <VStack
                        align="start"
                        spacing={0}
                    >
                        <Text
                            fontWeight="medium"
                            fontSize="lg"
                        >
                            {progressMessage}
                        </Text>
                        <Text
                            fontSize="sm"
                            color="secondaryText"
                        >
                            {timeLeft} left
                        </Text>
                    </VStack>
                </HStack>
            </Td>
            <Td>
                <VStack
                    align="start"
                    spacing={0}
                >
                    <Text
                        fontWeight="medium"
                        fontSize="lg"
                    >
                        {startTime.local().format('hh:mm A')}
                    </Text>
                    <Text
                        fontWeight="normal"
                        color="secondaryText"
                        fontSize="sm"
                    >
                        {startTime.local().format('MM/DD/YYYY')}
                    </Text>
                </VStack>
            </Td>
            {/* <Td>
                <Button
                    leftIcon={<Icon as={iconSet.view} />}
                    size="sm"
                    colorScheme="blue"
                >
                    Preview
                </Button>
            </Td> */}
        </Tr>
    );
}

function QueuedItem({ print, printer, printerType }) {
    const {
        startTime,
        progress,
        timeLeft,
        progressBarColor,
        progressMessage,
        queueTime,
        timeLeftHumanized,
        progressCircleColor
    } = usePrintProgress(print);

    const { detailedEvents } = usePrintEvents(print);

    const estStart = useMemo(() => {
        if (!detailedEvents) return null;
        return detailedEvents.find((e) => e.type === PrintStates.PRINTING && !e.happened).humanizedTimestamp;
    }, [detailedEvents]);

    return (
        <Tr>
            <Td>
                <HStack>
                    <VStack align="start">
                        <Text
                            fontWeight="semibold"
                            fontSize="lg"
                            as={Link}
                            href={`/printing/prints/${print._id}`}
                        >
                            {print.trayName}
                        </Text>

                        <PrinterTag
                            printer={printer}
                            printerType={printerType}
                        />
                    </VStack>
                </HStack>
            </Td>
            <Td>
                <VStack align="start">
                    <Text fontWeight="medium">{estStart}</Text>
                </VStack>
            </Td>
            <Td>
                <VStack
                    spacing={1}
                    align="start"
                >
                    <Tag
                        colorScheme={progressBarColor}
                        size="md"
                    >
                        <TagLabel>{progressMessage}</TagLabel>
                    </Tag>
                    <Text
                        color="secondaryText"
                        fontSize="sm"
                    >
                        {timeLeftHumanized}
                    </Text>
                </VStack>
            </Td>
            <Td>
                <VStack
                    align="start"
                    spacing={0}
                >
                    <Text
                        fontWeight="medium"
                        fontSize="lg"
                    >
                        {queueTime.local().format('hh:mm A')}
                    </Text>
                    <Text
                        fontWeight="normal"
                        color="secondaryText"
                        fontSize="sm"
                    >
                        {queueTime.local().format('MM/DD/YYYY')}
                    </Text>
                </VStack>
            </Td>
            {/* <Td>
                <Button
                    leftIcon={<Icon as={iconSet.view} />}
                    size="sm"
                    colorScheme="blue"
                >
                    Preview
                </Button>
            </Td> */}
        </Tr>
    );
}

export default function Logs(props) {
    const { printers, queue, printerTypes } = usePrinting();

    const printsInQueue = useMemo(() => {
        let printIds = [];

        printers.forEach((printer) => {
            if (printer.currentTray && !printer.queue.includes(printer.currentTray)) {
                printIds = printIds.concat(printer.queue);
            }
        });

        return printIds;
    }, [printers]);

    const printsPrinting = useMemo(() => {
        let printIds = [];

        printers.forEach((printer) => {
            if (printer.currentTray && printer.queue.includes(printer.currentTray)) {
                printIds.push(printer.currentTray);
            }
        });

        return printIds;
    }, [printers]);

    return (
        <>
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
                        spacing={8}
                        h="auto"
                        w="full"
                        align="start"
                        justify="start"
                        maxW="6xl"
                        p={5}
                    >
                        <VStack
                            w="full"
                            h="auto"
                        >
                            <HStack w="full">
                                <Heading size="lg">Prints currently printing</Heading>
                            </HStack>

                            <TableContainer w="full">
                                <Table
                                    size="md"
                                    w="full"
                                >
                                    <Thead>
                                        <Tr>
                                            <Th>Print</Th>
                                            <Th>Progress</Th>
                                            <Th>Printing since</Th>
                                            {/* <Th>Actions</Th> */}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {printsPrinting.map((printId) => {
                                            const print = queue.find((p) => p._id.toString() === printId);
                                            const printer = printers.find((p) => p.id === print?.printer);
                                            const printerType = printerTypes.find((t) => t.id === printer.type);

                                            return (
                                                <PrintingItem
                                                    key={printId}
                                                    print={print}
                                                    printer={printer}
                                                    printerType={printerType}
                                                />
                                            );
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </VStack>

                        <Divider />

                        <VStack
                            w="full"
                            h="auto"
                        >
                            <HStack w="full">
                                <Heading size="lg">Prints in queue</Heading>
                            </HStack>

                            <TableContainer w="full">
                                <Table
                                    size="md"
                                    w="full"
                                >
                                    <Thead>
                                        <Tr>
                                            <Th>Print</Th>
                                            <Th>Est. time until start</Th>
                                            <Th>Status</Th>
                                            <Th>Queued</Th>
                                            {/* <Th>Actions</Th> */}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {printsInQueue.map((printId) => {
                                            const print = queue.find((p) => p._id.toString() === printId);
                                            const printer = printers.find((p) => p.id === print?.printer);
                                            const printerType = printerTypes.find((t) => t.id === printer.type);

                                            return (
                                                <QueuedItem
                                                    key={printId}
                                                    print={print}
                                                    printer={printer}
                                                    printerType={printerType}
                                                />
                                            );
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </VStack>
                    </VStack>
                </Flex>
            </Box>
        </>
    );
}

Logs.getLayout = (page) => (
    <GlobalLayout>
        <Layout>{page}</Layout>
    </GlobalLayout>
);
