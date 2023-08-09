import { useCallback, useMemo, useState } from 'react';

import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    HStack,
    Icon,
    Link,
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

import NextLink from 'next/link';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';
import usePrintUpdate from '@/hooks/printing/usePrintUpdate';
import usePrinterUpdate from '@/hooks/printing/usePrinterUpdate';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

import UpdateModal from '@/components/printing/printers/UpdateModal';

import PrintEditorModal from '../printEdit/PrintEditorModal';

function QueueTableItem({ printData, startPrint, canQueue, update, editCallback }) {
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
                        <Link
                            fontSize="md"
                            as={NextLink}
                            href={`/printing/find/${betterPrintData._id}`}
                        >
                            {betterPrintData.trayName}
                        </Link>
                        <Badge
                            variant="subtle"
                            colorScheme={progressMessageColor}
                        >
                            {progressMessage}
                        </Badge>
                    </HStack>
                    <HStack
                        color="secondaryText"
                        fontSize="xs"
                        spacing={1.5}
                    >
                        <Icon
                            as={iconSet.clock}
                            fontSize="2xs"
                        />
                        <Text
                            fontSize="xs"
                            color="gray.500"
                        >
                            {betterPrintData.queuedAtHumanized}
                        </Text>
                    </HStack>
                </VStack>
            </Td>
            <Td>
                <Text fontSize="md">{betterPrintData.estTimeFormatted}</Text>
            </Td>
            <Td>
                {betterPrintData.state === PrintStates.PRINTING ? (
                    <ButtonGroup size="sm">
                        <Button
                            leftIcon={<Icon as={iconSet.check} />}
                            colorScheme="green"
                            variant="solid"
                            onClick={() => update(true)}
                        >
                            Completed
                        </Button>
                        <Button
                            leftIcon={<Icon as={iconSet.x} />}
                            colorScheme="red"
                            variant="solid"
                            onClick={() => update(false)}
                        >
                            Failed
                        </Button>
                    </ButtonGroup>
                ) : (
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
                            colorScheme="gray"
                            variant="solid"
                            onClick={editCallback}
                        >
                            Edit
                        </Button>
                    </ButtonGroup>
                )}
            </Td>
        </Tr>
    );
}

export default function QueueTable({ selectedPrinterData, activePrint }) {
    const { update: printUpdater } = usePrintUpdate();
    const printerUpdater = usePrinterUpdate(true);

    const { queue } = usePrinting();

    const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
    const [nextEventData, setNextEventData] = useState(null);
    const [printToEdit, setPrintToEdit] = useState(null);

    const printerQueue = useMemo(() => {
        return queue.filter(
            (print) =>
                print.printer === selectedPrinterData?.id &&
                print.state !== PrintStates.COMPLETED &&
                print.state !== PrintStates.CANCELED
        );
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
                    type: PrintStates.PRINTING,
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

    function completePrint(completed) {
        let eventData;
        if (completed) {
            eventData = {
                type: PrintStates.COMPLETED,
                timestamp: dayjs.utc().toISOString(),
                notes: ''
            };
        } else {
            eventData = {
                type: PrintStates.FAILED,
                timestamp: dayjs.utc().toISOString(),
                notes: ''
            };
        }
        setNextEventData(eventData);
        onUpdateOpen();
    }

    const confirmUpdate = useCallback(
        (event) => {
            let data = {
                ...activePrint,
                state: event.type,
                events: [event, ...activePrint.events]
            };
            printUpdater(activePrint._id, data);
            onUpdateClose();
        },
        [activePrint, printUpdater, onUpdateClose]
    );

    return (
        <>
            <UpdateModal
                isOpen={isUpdateOpen}
                onClose={onUpdateClose}
                eventData={nextEventData}
                save={confirmUpdate}
            />
            {printToEdit && (
                <PrintEditorModal
                    isOpen={isEditorOpen}
                    onClose={onEditorClose}
                    initialData={printToEdit}
                />
            )}

            <Box
                w="100%"
                h="auto"
            >
                {printerQueue.length > 0 ? (
                    <TableContainer maxW="100%">
                        <Table
                            variant="simple"
                            size="sm"
                        >
                            <Thead>
                                <Tr>
                                    <Th>Print (oldest first)</Th>
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
                                            update={completePrint}
                                            editCallback={() => {
                                                setPrintToEdit(print);
                                                onEditorOpen();
                                            }}
                                        />
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                ) : (
                    <>
                        <HStack
                            w="full"
                            justify="start"
                        >
                            <Text
                                fontSize="md"
                                color="secondaryText"
                            >
                                This printer&apos;s queue is empty.
                            </Text>
                        </HStack>
                    </>
                )}
            </Box>
        </>
    );
}
