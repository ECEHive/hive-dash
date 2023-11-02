import { useMemo } from 'react';

import {
    Box,
    Button,
    CircularProgress,
    HStack,
    Heading,
    Icon,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintProgress from '@/hooks/printing/usePrintProgress';

import iconSet from '@/util/icons';

import GlobalLayout from '@/layouts/GlobalLayout';
import Layout from '@/layouts/PrintingLayout';

function PrintItem({ print, printer, printerType }) {
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
                        >
                            {print.trayName}
                        </Text>

                        <Tag colorScheme={printerType.color}>{print.printer}</Tag>
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
                        {startTime.format('hh:mm A')}
                    </Text>
                    <Text
                        fontWeight="normal"
                        color="secondaryText"
                        fontSize="sm"
                        fontFamily="mono"
                    >
                        {startTime.format('MM/DD/YYYY')}
                    </Text>
                </VStack>
            </Td>
            <Td>
                <Button
                    leftIcon={<Icon as={iconSet.view} />}
                    size="sm"
                    colorScheme="blue"
                >
                    Preview
                </Button>
            </Td>
        </Tr>
    );
}

export default function Logs(props) {
    const { printers, queue, printerTypes } = usePrinting();

    const printsInQueue = useMemo(() => {
        let printIds = [];

        printers.forEach((printer) => {
            printIds = printIds.concat(printer.queue);
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
            {/* <CompleteConfirm /> */}
            <Box
                w="full"
                h="full"
                overflow="hidden"
            >
                <VStack
                    spacing={8}
                    h="full"
                    w="full"
                    overflow="auto"
                    align="start"
                    p={5}
                >
                    <VStack w="full">
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
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {printsPrinting.map((printId) => {
                                        const print = queue.find((p) => p._id.toString() === printId);

                                        const printer = printers.find((p) => p.id === print.printer);
                                        const printerType = printerTypes.find((t) => t.id === printer.type);

                                        return (
                                            <PrintItem
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
            </Box>
        </>
    );
}

Logs.getLayout = (page) => (
    <GlobalLayout>
        <Layout>{page}</Layout>
    </GlobalLayout>
);
