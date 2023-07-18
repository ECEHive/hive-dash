import { useContext, useMemo } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Badge,
    IconButton,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Tooltip,
    useToast
} from '@chakra-ui/react';
import { FaPlay, FaPencilAlt } from 'react-icons/fa';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';
import usePrintUpdate from '@/hooks/usePrintUpdate';
import usePrinterUpdate from '@/hooks/usePrinterUpdate';
import getStateColor from '@/util/getStateColor';

export default function QueueTable({ selectedPrinterId, selectedPrinterData, activePrint }) {
    const printUpdater = usePrintUpdate();
    const printerUpdater = usePrinterUpdate(true);

    const { queue } = useContext(PrintingContext);

    const printerQueue = useMemo(() => {
        return queue.filter((print) => print.printer === selectedPrinterId && !print.completed);
    }, [selectedPrinterId, queue]);

    const canQueue = useMemo(() => {
        return !activePrint?.printing
    }, [activePrint]);

    function startPrint(printData) {
        let newPrintData = {
            ...printData,
            printing: true,
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
        <Box w="100%" h="auto">
            <TableContainer maxW="100%">
                <Table variant="simple" size="sm">
                    <Thead>
                        <Tr>
                            <Th>Queue date</Th>
                            <Th>Status</Th>
                            <Th>Print name</Th>
                            <Th>Est. time</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {printerQueue.map((print) => {
                            let queueDate = dayjs
                                .utc(print.queuedAt)
                                .local()
                                .format('MM/DD/YYYY');

                            let fullQueueDate = dayjs
                                .utc(print.queuedAt)
                                .local()
                                .format('MM/DD/YYYY HH:mm A');

                            let estTime = dayjs
                                .duration(print.estTime)
                                .format('HH:mm');
                            return (
                                <Tr key={print._id}>
                                    <Tooltip
                                        label={fullQueueDate}
                                        placement="bottom-start"
                                    >
                                        <Td>{queueDate}</Td>
                                    </Tooltip>
                                    <Td>
                                        <Badge
                                            variant="subtle"
                                            colorScheme={getStateColor(
                                                print.events[0].type
                                            )}
                                        >
                                            {print.events[0].type}
                                        </Badge>
                                    </Td>
                                    <Td
                                        overflow="hidden"
                                        whiteSpace="nowarp"
                                        textOverflow="ellipsis"
                                    >
                                        {print.trayName}
                                    </Td>
                                    <Td>{estTime}</Td>
                                    <Td>
                                        <ButtonGroup size="sm" isAttached>
                                            <IconButton
                                                icon={<FaPlay />}
                                                colorScheme="green"
                                                variant="outline"
                                                isDisabled={!canQueue}
                                                onClick={() =>
                                                    startPrint(print)
                                                }
                                            />
                                            <IconButton
                                                icon={<FaPencilAlt />}
                                                colorScheme="orange"
                                                variant="outline"
                                            />
                                        </ButtonGroup>
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}
