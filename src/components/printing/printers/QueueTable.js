import { useContext, useMemo } from 'react';
import { FaPencilAlt, FaPlay } from 'react-icons/fa';

import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    IconButton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr,
    useToast
} from '@chakra-ui/react';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

import usePrintUpdate from '@/hooks/usePrintUpdate';
import usePrinterUpdate from '@/hooks/usePrinterUpdate';

import getStateColor from '@/util/getStateColor';

import QueueTableItem from './QueueTableItem';

export default function QueueTable({ selectedPrinterData, activePrint }) {
    const printUpdater = usePrintUpdate();
    const printerUpdater = usePrinterUpdate(true);

    const { queue } = useContext(PrintingContext);

    const printerQueue = useMemo(() => {
        return queue.filter((print) => print.printer === selectedPrinterData?.id && !print.completed);
    }, [selectedPrinterData, queue]);

    const canQueue = useMemo(() => {
        return !activePrint?.printing && selectedPrinterData?.enabled;
    }, [activePrint, selectedPrinterData]);

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
