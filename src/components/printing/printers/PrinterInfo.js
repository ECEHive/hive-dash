import { useCallback, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    HStack,
    Heading,
    Icon,
    IconButton,
    Spacer,
    Text,
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import dayjs from '@/lib/time';

import usePrintUpdate from '@/hooks/usePrintUpdate';
import usePrinterParser from '@/hooks/usePrinterParser';
import usePrinterUpdate from '@/hooks/usePrinterUpdate';
import useTextColor from '@/hooks/useTextColor';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

import PrintPreview from '@/components/printing/PrintPreview';
import MaintenanceModal from '@/components/printing/maintenance/MaintenanceModal';
import StatusModal from '@/components/printing/maintenance/StatusModal';
import QueueTable from '@/components/printing/printers/QueueTable';
import UpdateModal from '@/components/printing/printers/UpdateModal';

export default function PrinterInfo({ selectedPrinterData }) {
    const { update: printUpdater } = usePrintUpdate();
    const printerUpdater = usePrinterUpdate();

    const { secondary } = useTextColor();

    const { isOpen: isMaintenanceOpen, onOpen: onMaintenanceOpen, onClose: onMaintenanceClose } = useDisclosure();
    const { isOpen: isStatusOpen, onOpen: onStatusOpen, onClose: onStatusClose } = useDisclosure();
    const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();

    const { currentPrintData: activePrint } = usePrinterParser(selectedPrinterData);

    const [nextEventData, setNextEventData] = useState(null);

    function completePrint(completed) {
        let eventData;
        if (completed) {
            eventData = {
                type: 'completed',
                timestamp: dayjs.utc().toISOString(),
                notes: ''
            };
        } else {
            eventData = {
                type: 'failed',
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
                state: event.type === 'completed' ? PrintStates.COMPLETED : PrintStates.FAILED,
                completed: event.type === 'completed' || activePrint.completed,
                events: [event, ...activePrint.events]
            };
            printUpdater(activePrint._id, data);
            onUpdateClose();
        },
        [activePrint, printUpdater, onUpdateClose]
    );

    return (
        <>
            {selectedPrinterData && (
                <>
                    <MaintenanceModal
                        isOpen={isMaintenanceOpen}
                        onClose={onMaintenanceClose}
                        printerData={selectedPrinterData}
                    />
                    <StatusModal
                        isOpen={isStatusOpen}
                        onClose={onStatusClose}
                        printerData={selectedPrinterData}
                    />
                    <UpdateModal
                        isOpen={isUpdateOpen}
                        onClose={onUpdateClose}
                        eventData={nextEventData}
                        save={confirmUpdate}
                    />
                </>
            )}
            <Card
                h="100%"
                flexGrow={1}
                variant="outline"
                borderRadius={10}
            >
                <CardBody>
                    {/* <Box w="auto" h="100%" p={2}> */}
                    {selectedPrinterData ? (
                        <>
                            <HStack
                                w="100%"
                                mb={4}
                                alignItems="center"
                            >
                                <Heading size="lg">{selectedPrinterData.displayName}</Heading>
                                <Spacer />
                                <IconButton
                                    icon={<Icon as={iconSet.wrench} />}
                                    colorScheme="orange"
                                    onClick={onMaintenanceOpen}
                                />
                            </HStack>
                            <VStack
                                alignItems="flex-start"
                                h="auto"
                                w="100%"
                                spacing={4}
                                overflow="auto"
                            >
                                {!selectedPrinterData.enabled && (
                                    <Box
                                        w="100%"
                                        h="auto"
                                    >
                                        <Alert
                                            status="error"
                                            borderRadius={5}
                                        >
                                            <AlertIcon />
                                            <HStack w="100%">
                                                <AlertTitle>This printer is down.</AlertTitle>
                                                <Spacer />
                                                <Button
                                                    size="sm"
                                                    onClick={onStatusOpen}
                                                >
                                                    Read more
                                                </Button>
                                            </HStack>
                                        </Alert>
                                    </Box>
                                )}
                                {/* current print */}
                                {activePrint && (
                                    <PrintPreview
                                        print={activePrint}
                                        actions={
                                            activePrint.state === PrintStates.PRINTING && (
                                                <ButtonGroup
                                                    variant="outline"
                                                    size="md"
                                                >
                                                    <Button
                                                        colorScheme="red"
                                                        leftIcon={<CloseIcon />}
                                                        onClick={() => completePrint(false)}
                                                    >
                                                        Failed
                                                    </Button>
                                                    <Button
                                                        colorScheme="green"
                                                        leftIcon={<CheckIcon />}
                                                        onClick={() => completePrint(true)}
                                                    >
                                                        Completed
                                                    </Button>
                                                </ButtonGroup>
                                            )
                                        }
                                    />
                                )}

                                {/* queue */}
                                <QueueTable
                                    activePrint={activePrint}
                                    selectedPrinterData={selectedPrinterData}
                                />
                            </VStack>
                        </>
                    ) : (
                        <VStack
                            h="100%"
                            w="100%"
                            justify="center"
                        >
                            <Text color={secondary}>select a printer</Text>
                        </VStack>
                    )}
                    {/* </Box> */}
                </CardBody>
            </Card>
        </>
    );
}
