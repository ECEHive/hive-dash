import { useContext, useMemo } from 'react';

import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    HStack,
    Icon,
    IconButton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    VStack,
    useToast
} from '@chakra-ui/react';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/usePrintParser';
import usePrintProgress from '@/hooks/usePrintProgress';
import usePrintUpdate from '@/hooks/usePrintUpdate';
import usePrinterUpdate from '@/hooks/usePrinterUpdate';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

function QueueTableItem({ printData, startPrint, canQueue }) {
    const { betterPrintData } = usePrintParser(printData);
    const { progressMessage, progressMessageColor } = usePrintProgress(printData);

    return (
        <Tr key={print._id}>
            <Td>
                <VStack
                    align="start"
                    justify="start"
                    spacing={1}
                >
                    <HStack>
                        <Text fontSize="md">{betterPrintData.trayName}</Text>
                        <Badge
                            variant="subtle"
                            colorScheme={progressMessageColor}
                        >
                            {progressMessage}
                        </Badge>
                    </HStack>
                    <Text
                        fontSize="xs"
                        color="gray.500"
                    >
                        {betterPrintData.queuedAtHumanized}
                    </Text>
                </VStack>
            </Td>
            <Td>
                <Text fontSize="md">{betterPrintData.estTimeFormatted}</Text>
            </Td>
            <Td>
                <ButtonGroup size="sm">
                    <Button
                        leftIcon={<Icon as={iconSet.play} />}
                        colorScheme="green"
                        variant="solid"
                        isDisabled={!canQueue}
                        onClick={() => startPrint(printData)}
                    >
                        Start
                    </Button>
                    <Button
                        leftIcon={<Icon as={iconSet.pencil} />}
                        colorScheme="orange"
                        variant="solid"
                    >
                        Edit
                    </Button>
                </ButtonGroup>
            </Td>
        </Tr>
    );
}

export default function QueueTable({ selectedPrinterData, activePrint }) {
    const { update: printUpdater } = usePrintUpdate();
    const printerUpdater = usePrinterUpdate(true);

    const { queue } = useContext(PrintingContext);

    const printerQueue = useMemo(() => {
        return queue.filter((print) => print.printer === selectedPrinterData?.id && !print.completed);
    }, [selectedPrinterData, queue]);

    const canQueue = useMemo(() => {
        return activePrint?.state !== PrintStates.PRINTING && selectedPrinterData?.enabled;
    }, [activePrint, selectedPrinterData]);

    function startPrint(printData) {
        let newPrintData = {
            ...printData,
            state: PrintStates.PRINTING,
            events: [
                {
                    type: 'printing',
                    timestamp: dayjs.utc()
                },
                ...printData.events
            ]
        };

        let newPrinterData = {
            ...selectedPrinterData,
            currentTray: printData._id
        };

        printerUpdater(selectedPrinterData._id, newPrinterData);
        printUpdater(printData._id, newPrintData);
    }

    return (
        <Box
            w="100%"
            h="auto"
        >
            <TableContainer maxW="100%">
                <Table
                    variant="simple"
                    size="sm"
                >
                    <Thead>
                        <Tr>
                            <Th>Print info</Th>
                            <Th>Est. time</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {printerQueue.map((print) => {
                            return (
                                <QueueTableItem
                                    key={print._id}
                                    printData={print}
                                    startPrint={startPrint}
                                    canQueue={canQueue}
                                />
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}
