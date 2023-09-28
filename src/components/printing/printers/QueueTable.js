import { useCallback, useMemo, useState } from 'react';

import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    HStack,
    Icon,
    IconButton,
    Link,
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

import NextLink from 'next/link';

import dayjs from '@/lib/time';

import { useAuth } from '@/contexts/AuthContext';
import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';
import usePrintUpdate from '@/hooks/printing/usePrintUpdate';
import usePrinterUpdate from '@/hooks/printing/usePrinterUpdate';

import iconSet from '@/util/icons';
import { PITypes } from '@/util/roles';
import { PrintStates } from '@/util/states';

import UpdateModal from '@/components/printing/printers/UpdateModal';

import PrintEditorModal from '../printEdit/PrintEditorModal';

function QueueTableItem({
    printData,
    startPrint,
    canQueue,
    update,
    editCallback,
    showActions,
    editMode,
    isChecked,
    onCheck
}) {
    const { betterPrintData } = usePrintParser(printData);
    const { progressMessage, progressMessageColor } = usePrintProgress(printData);

    return (
        <Tr key={print._id}>
            {editMode && (
                <Td>
                    <Checkbox
                        isChecked={isChecked}
                        onChange={onCheck}
                    />
                </Td>
            )}
            <Td>
                <VStack
                    align="start"
                    justify="start"
                    spacing={1}
                >
                    <HStack>
                        <Link
                            fontSize="md"
                            fontWeight="medium"
                            as={NextLink}
                            href={`/printing/prints/${betterPrintData._id}`}
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
            {showActions && !editMode && (
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
                            <IconButton
                                icon={<Icon as={iconSet.pencil} />}
                                colorScheme="gray"
                                variant="solid"
                                onClick={editCallback}
                            >
                                Edit
                            </IconButton>
                        </ButtonGroup>
                    )}
                </Td>
            )}
        </Tr>
    );
}

export default function QueueTable({ selectedPrinterData, activePrint }) {
    const { update: printUpdater } = usePrintUpdate();
    const printerUpdater = usePrinterUpdate(true);

    const { queue } = usePrinting();
    const { roleId } = useAuth();

    const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();

    const [editMode, setEditMode] = useState(false);
    const [nextEventData, setNextEventData] = useState(null);
    const [printToEdit, setPrintToEdit] = useState(null);

    const [checkedPrints, setCheckedPrints] = useState([]);

    const printerQueue = useMemo(() => {
        const q = queue.filter(
            (print) =>
                print.printer === selectedPrinterData?.id &&
                print.state !== PrintStates.COMPLETED &&
                print.state !== PrintStates.CANCELED
        );

        return q;
    }, [selectedPrinterData, queue]);

    const checkAll = useCallback(() => {
        setCheckedPrints(printerQueue.map((print) => print._id));
    }, [printerQueue]);

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
            printUpdater(activePrint._id, data)
                .then(() => {
                    onUpdateClose();
                })
                .catch((err) => {
                    console.log('err');
                    onUpdateClose();
                });
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
                    <VStack spacing={5}>
                        <HStack
                            w="full"
                            spacing={5}
                        >
                            <ButtonGroup size="sm">
                                {!editMode ? (
                                    <Button
                                        leftIcon={<Icon as={iconSet.boxes} />}
                                        variant="outline"
                                        onClick={() => setEditMode(true)}
                                    >
                                        Edit queue
                                    </Button>
                                ) : (
                                    <Button
                                        leftIcon={<Icon as={iconSet.check} />}
                                        variant="outline"
                                        onClick={() => setEditMode(false)}
                                    >
                                        Done
                                    </Button>
                                )}
                            </ButtonGroup>
                            {editMode && (
                                <>
                                    <Text>{checkedPrints.length} selected</Text>
                                    <Spacer />
                                    <ButtonGroup size="sm">
                                        <IconButton
                                            variant="outline"
                                            colorScheme="gray"
                                            isDisabled={() => {
                                                // check if prints can be moved up, i.e. if the first ordered print is included in the selection and it's at the top, we can't move anymore
                                            }}
                                        >
                                            <Icon as={iconSet.upArrow} />
                                        </IconButton>
                                        <IconButton
                                            variant="outline"
                                            colorScheme="gray"
                                        >
                                            <Icon as={iconSet.downArrow} />
                                        </IconButton>

                                        <Button
                                            variant="outline"
                                            leftIcon={<Icon as={iconSet.sendTo} />}
                                            colorScheme="yellow"
                                        >
                                            Move to printer
                                        </Button>
                                    </ButtonGroup>
                                </>
                            )}
                        </HStack>
                        <TableContainer w="full">
                            <Table
                                variant="simple"
                                size="sm"
                                w="full"
                            >
                                <Thead>
                                    <Tr>
                                        {editMode && (
                                            <Th>
                                                <Checkbox
                                                    isChecked={checkedPrints.length === printerQueue.length}
                                                    onChange={() => {
                                                        if (checkedPrints.length > 0) {
                                                            setCheckedPrints([]);
                                                        } else {
                                                            checkAll();
                                                        }
                                                    }}
                                                    isIndeterminate={
                                                        !(checkedPrints.length === printerQueue.length) &&
                                                        checkedPrints.length > 0
                                                    }
                                                />
                                            </Th>
                                        )}
                                        <Th>Print</Th>
                                        <Th>Est. time</Th>
                                        {roleId >= PITypes.PI && !editMode && (
                                            <>
                                                <Th>Actions</Th>
                                            </>
                                        )}
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
                                                showActions={roleId >= PITypes.PI}
                                                editMode={editMode}
                                                isChecked={checkedPrints.includes(print._id)}
                                                onCheck={(e) => {
                                                    if (e.target.checked) {
                                                        setCheckedPrints((prev) => [...prev, print._id]);
                                                    } else {
                                                        setCheckedPrints((prev) =>
                                                            prev.filter((id) => id !== print._id)
                                                        );
                                                    }
                                                }}
                                            />
                                        );
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </VStack>
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
