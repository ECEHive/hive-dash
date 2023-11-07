import { useMemo } from 'react';

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    CircularProgress,
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
                            fontWeight="medium"
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
                            fontSize="md"
                            fontWeight="medium"
                        >
                            {progressMessage}
                        </Text>
                        <Text
                            fontSize="xs"
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
                        fontSize="md"
                    >
                        {startTime.local().format('h:mm A')}
                    </Text>
                    <Text
                        fontWeight="normal"
                        color="secondaryText"
                        fontSize="xs"
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
                    <Text
                        fontWeight="medium"
                        fontSize="md"
                    >
                        {estStart}
                    </Text>
                </VStack>
            </Td>
            <Td>
                <VStack
                    spacing={0}
                    align="start"
                >
                    <Tag
                        colorScheme={progressBarColor}
                        size="md"
                        w="auto"
                    >
                        <TagLabel>{progressMessage}</TagLabel>
                    </Tag>
                    <Text
                        color="secondaryText"
                        fontSize="xs"
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
                        fontSize="md"
                    >
                        {queueTime.local().format('h:mm A')}
                    </Text>
                    <Text
                        fontWeight="normal"
                        color="secondaryText"
                        fontSize="xs"
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
            printer.queue.forEach((printId) => {
                const print = queue.find((p) => p._id.toString() === printId);
                if (print.state !== PrintStates.PRINTING) {
                    printIds.push(printId);
                }
            });
        });

        return printIds;
    }, [printers, queue]);

    const printsPrinting = useMemo(() => {
        let printIds = [];

        printers.forEach((printer) => {
            const print = queue.find((p) => p._id.toString() === printer.currentTray);
            if (
                printer.currentTray &&
                printer.queue.includes(printer.currentTray) &&
                print.state === PrintStates.PRINTING
            ) {
                printIds.push(printer.currentTray);
            }
        });

        return printIds;
    }, [printers, queue]);

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
                        h="auto"
                        w="full"
                        align="start"
                        justify="start"
                        maxW="8xl"
                        p={5}
                    >
                        <Accordion
                            w="full"
                            allowMultiple
                            allowToggle
                            defaultIndex={[0]}
                        >
                            <AccordionItem border="none">
                                <AccordionButton px={0}>
                                    <HStack w="full">
                                        <Heading size="lg">Prints currently printing</Heading>
                                    </HStack>
                                    <AccordionIcon />
                                </AccordionButton>

                                <AccordionPanel>
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
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem border="none">
                                <AccordionButton px={0}>
                                    <HStack w="full">
                                        <Heading size="lg">Prints in queue</Heading>
                                    </HStack>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>
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
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem border="none">
                                <AccordionButton px={0}>
                                    <HStack w="full">
                                        <Heading size="lg">Recently completed prints</Heading>
                                    </HStack>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>
                                    <TableContainer w="full">
                                        <Table
                                            size="md"
                                            w="full"
                                        ></Table>
                                    </TableContainer>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
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
