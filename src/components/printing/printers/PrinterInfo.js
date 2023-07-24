import { FaWrench } from 'react-icons/fa';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

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
    IconButton,
    Spacer,
    Text,
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

import dayjs from '@/lib/time';

import usePrintUpdate from '@/hooks/usePrintUpdate';
import usePrinterParser from '@/hooks/usePrinterParser';
import usePrinterUpdate from '@/hooks/usePrinterUpdate';

import PrintPreview from '@/components/printing/PrintPreview';
import MaintenanceModal from '@/components/printing/maintenance/MaintenanceModal';
import StatusModal from '@/components/printing/maintenance/StatusModal';
import QueueTable from '@/components/printing/printers/QueueTable';

export default function PrinterInfo({ selectedPrinterData }) {
    const printUpdater = usePrintUpdate();
    const printerUpdater = usePrinterUpdate();

    const { isOpen: isMaintenanceOpen, onOpen: onMaintenanceOpen, onClose: onMaintenanceClose } = useDisclosure();
    const { isOpen: isStatusOpen, onOpen: onStatusOpen, onClose: onStatusClose } = useDisclosure();

    const { currentPrintData: activePrint } = usePrinterParser(selectedPrinterData);

    function cancelPrint(printData) {
        let data = {
            ...printData,
            printing: false,
            events: [
                {
                    type: 'failed',
                    timestamp: dayjs.utc()
                },
                ...printData.events
            ]
        };
        printUpdater(printData._id, data);
    }

    function completePrint(printData) {
        let data = {
            ...printData,
            printing: false,
            completed: true,
            events: [
                {
                    type: 'completed',
                    timestamp: dayjs.utc()
                },
                ...printData.events
            ]
        };
        printUpdater(printData._id, data);
    }

    return (
        <>
            {selectedPrinterData && (
                <>
                    <MaintenanceModal
                        open={isMaintenanceOpen}
                        onClose={onMaintenanceClose}
                        printerData={selectedPrinterData}
                    />
                    <StatusModal
                        open={isStatusOpen}
                        onClose={onStatusClose}
                        printerData={selectedPrinterData}
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
                                    icon={<FaWrench />}
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
                                            activePrint.printing && (
                                                <ButtonGroup
                                                    variant="outline"
                                                    size="md"
                                                >
                                                    <Button
                                                        colorScheme="red"
                                                        leftIcon={<CloseIcon />}
                                                        onClick={() => cancelPrint(activePrint)}
                                                    >
                                                        Failed
                                                    </Button>
                                                    <Button
                                                        colorScheme="green"
                                                        leftIcon={<CheckIcon />}
                                                        onClick={() => completePrint(activePrint)}
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
                            </VStack>{' '}
                        </>
                    ) : (
                        <VStack
                            h="100%"
                            w="100%"
                            justify="center"
                        >
                            <Text color="gray.400">select a printer</Text>
                        </VStack>
                    )}
                    {/* </Box> */}
                </CardBody>
            </Card>
        </>
    );
}
