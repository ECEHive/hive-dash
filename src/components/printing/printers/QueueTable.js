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

import PrintingContext from '@/contexts/PrintingContext';

export default function QueueTable({ selectedPrinterId }) {
    const toast = useToast();

    const { queue } = useContext(PrintingContext);

    const printerQueue = useMemo(() => {
        return queue.filter((print) => print.printer === selectedPrinterId);
    }, [selectedPrinterId, queue]);

    const canQueue = useMemo(() => {
        const activePrint = queue.find(
            (print) => print.printer === selectedPrinterId && print.printing
        );
        return !activePrint;
    }, [selectedPrinterId, queue]);

    function startPrint(printData) {
        let data = {
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
        delete data._id;

        fetch(`/api/printing/${printData._id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => {
                toast({
                    title: 'Success',
                    description: 'Print started',
                    status: 'success',
                    duration: 5000
                });
            })
            .catch((err) => {
                toast({
                    title: 'Error',
                    description: `Couldn't start print: ${err}`,
                    status: 'error',
                    duration: 5000
                });
            });
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
                            return (
                                <Tr key={print._id}>
                                    <Tooltip
                                        label="2021-09-01 4:10 PM"
                                        placement="bottom-start"
                                    >
                                        <Td>{queueDate}</Td>
                                    </Tooltip>
                                    <Td>
                                        <Badge
                                            variant="subtle"
                                            colorScheme="red"
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
                                    <Td>{print.estTime}</Td>
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
