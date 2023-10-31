import { useCallback, useEffect, useMemo, useState } from 'react';

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
import useRequest from '@/hooks/useRequest';

import iconSet from '@/util/icons';
import { PITypes } from '@/util/roles';
import { PrintStates } from '@/util/states';

import UpdateModal from '@/components/printing/printers/UpdateModal';

import PrintEditorModal from '../printEdit/PrintEditorModal';
import MoveModal from './MoveModal';

function QueueTableItem({
    printData,
    startPrint,
    canQueue,
    update,
    editCallback,
    showActions,
    editMode,
    isChecked,
    onCheck,
    onReorder
}) {
    const { betterPrintData } = usePrintParser(printData);
    const { progressMessage, progressMessageColor } = usePrintProgress(printData);

    return (
        <Tr>
            {editMode && (
                <Td>
                    <Checkbox
                        isDisabled={printData.state === PrintStates.PRINTING}
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
            {showActions && editMode && (
                <Td>
                    <ButtonGroup
                        size="sm"
                        isDisabled={printData.state === PrintStates.PRINTING}
                    >
                        <IconButton
                            variant="outline"
                            colorScheme="gray"
                            // isDisabled={() => {
                            //     // check if prints can be moved up, i.e. if the first ordered print is included in the selection and it's at the top, we can't move anymore
                            // }}
                            onClick={() => onReorder(1)}
                        >
                            <Icon as={iconSet.upArrow} />
                        </IconButton>
                        <IconButton
                            variant="outline"
                            colorScheme="gray"
                            onClick={() => onReorder(-1)}
                        >
                            <Icon as={iconSet.downArrow} />
                        </IconButton>
                    </ButtonGroup>
                </Td>
            )}
        </Tr>
    );
}

export default function QueueTable({ selectedPrinterData, activePrint }) {
    const { update: printUpdater } = usePrintUpdate();
    const printerUpdater = usePrinterUpdate(true);

    const { roleId } = useAuth();
    const { queue, refreshDynamicData } = usePrinting();
    const request = useRequest();

    const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
    const { isOpen: isMoveOpen, onOpen: onMoveOpen, onClose: onMoveClose } = useDisclosure();

    const [editMode, setEditMode] = useState(false);
    const [nextEventData, setNextEventData] = useState(null);
    const [printToEdit, setPrintToEdit] = useState(null);

    const [editedCopy, setEditedCopy] = useState([]);

    const [checkedPrints, setCheckedPrints] = useState([]);

    const checkablePrints = useMemo(() => {
        return selectedPrinterData.queue.filter(
            (print) => queue.find((p) => p._id.toString() === print)?.state !== PrintStates.PRINTING
        );
    }, [selectedPrinterData.queue, queue]);

    const checkAll = useCallback(() => {
        setCheckedPrints(
            selectedPrinterData.queue.filter(
                (print) => queue.find((p) => p._id.toString() === print).state !== PrintStates.PRINTING
            )
        );
    }, [selectedPrinterData.queue, queue]);

    const canQueue = useMemo(() => {
        return activePrint?.state !== PrintStates.PRINTING && selectedPrinterData?.enabled;
    }, [activePrint, selectedPrinterData]);

    useEffect(() => {
        setEditedCopy(selectedPrinterData.queue);
        setCheckedPrints([]);
        setEditMode(false);
    }, [selectedPrinterData.queue]);

    function startPrint(printData) {
        let newPrintData = {
            ...printData,
            state: PrintStates.PRINTING,
            events: [
                ...printData.events,
                {
                    type: PrintStates.PRINTING,
                    timestamp: dayjs.utc()
                }
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
                events: [...activePrint.events, event]
            };
            printUpdater(activePrint._id, data, event.type === PrintStates.COMPLETED)
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

    function startEdit() {
        setEditedCopy([...selectedPrinterData.queue]);
        setEditMode(true);
    }

    function endEdit() {
        // post changes to server
        request(`/api/printing/queue/reorder/${selectedPrinterData.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                reorderedQueue: editedCopy
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {})
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                refreshDynamicData();
                setEditMode(false);
                setEditedCopy([...selectedPrinterData.queue]);
                setCheckedPrints([]);
            });
    }

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
            <MoveModal
                isOpen={isMoveOpen}
                onClose={onMoveClose}
                originalPrinter={selectedPrinterData}
                prints={checkedPrints}
            />

            <Box
                w="100%"
                h="auto"
            >
                {selectedPrinterData.queue.length > 0 ? (
                    <VStack spacing={5}>
                        {roleId >= PITypes.MPI && (
                            <HStack
                                w="full"
                                spacing={5}
                            >
                                <ButtonGroup size="sm">
                                    {!editMode ? (
                                        <Button
                                            leftIcon={<Icon as={iconSet.boxes} />}
                                            variant="outline"
                                            onClick={() => startEdit()}
                                        >
                                            Edit queue
                                        </Button>
                                    ) : (
                                        <Button
                                            leftIcon={<Icon as={iconSet.check} />}
                                            variant="outline"
                                            onClick={() => endEdit()}
                                        >
                                            Done
                                        </Button>
                                    )}
                                </ButtonGroup>

                                {editMode && (
                                    <>
                                        <Badge
                                            fontSize="sm"
                                            colorScheme="yellow"
                                        >
                                            {checkedPrints.length} selected
                                        </Badge>
                                        <Spacer />
                                        <ButtonGroup size="sm">
                                            <Button
                                                variant="outline"
                                                leftIcon={<Icon as={iconSet.sendTo} />}
                                                colorScheme="yellow"
                                                onClick={() => onMoveOpen()}
                                                isDisabled={checkedPrints.length === 0}
                                            >
                                                Move prints
                                            </Button>
                                        </ButtonGroup>
                                    </>
                                )}
                            </HStack>
                        )}
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
                                                    isChecked={
                                                        checkedPrints.length === checkablePrints.length &&
                                                        checkablePrints.length > 0
                                                    }
                                                    onChange={() => {
                                                        if (checkedPrints.length > 0) {
                                                            setCheckedPrints([]);
                                                        } else {
                                                            checkAll();
                                                        }
                                                    }}
                                                    isDisabled={checkablePrints.length === 0}
                                                    isIndeterminate={
                                                        !(checkedPrints.length === checkablePrints.length) &&
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
                                        {roleId >= PITypes.PI && editMode && (
                                            <>
                                                <Th>Reorder</Th>
                                            </>
                                        )}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {editedCopy &&
                                        editedCopy.map((printId) => {
                                            const print = queue.find((print) => print._id === printId);
                                            return (
                                                <>
                                                    {print ? (
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
                                                            onReorder={(dir) => {
                                                                // move print in queue
                                                                console.log(dir);
                                                                if (dir === 1) {
                                                                    // move up in editedCopy
                                                                    setEditedCopy((prev) => {
                                                                        // make sure it can move up, i.e. if the print above is the current print, don't move
                                                                        let newCopy = [...prev];
                                                                        let index = newCopy.indexOf(print._id);
                                                                        let temp = newCopy[index - 1];
                                                                        newCopy[index - 1] = newCopy[index];
                                                                        newCopy[index] = temp;
                                                                        return newCopy;
                                                                    });
                                                                } else {
                                                                    setEditedCopy((prev) => {
                                                                        let newCopy = [...prev];
                                                                        let index = newCopy.indexOf(print._id);
                                                                        let temp = newCopy[index + 1];
                                                                        newCopy[index + 1] = newCopy[index];
                                                                        newCopy[index] = temp;
                                                                        return newCopy;
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    ) : null}
                                                </>
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
