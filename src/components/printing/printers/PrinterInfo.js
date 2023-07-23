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
import QueueTable from '@/components/printing/printers/QueueTable';

import MaintenanceModal from '../maintenance/MaintenanceModal';

export default function PrinterInfo({ selectedPrinterData }) {
    const printUpdater = usePrintUpdate();
    const printerUpdater = usePrinterUpdate();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { currentPrintData: activePrint } =
        usePrinterParser(selectedPrinterData);

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
            <MaintenanceModal
                open={isOpen}
                onClose={onClose}
                printerData={selectedPrinterData}
            />
            <Card h="100%" flexGrow={1} variant="outline" borderRadius={10}>
                <CardBody>
                    {/* <Box w="auto" h="100%" p={2}> */}
                    <HStack w="100%" mb={4} alignItems="center">
                        <Heading size="lg">
                            {selectedPrinterData.displayName}
                        </Heading>
                        <Spacer />
                        <IconButton
                            icon={<FaWrench />}
                            colorScheme="orange"
                            onClick={onOpen}
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
                            <Box w="100%" h="auto">
                                <Alert status="error" borderRadius={5}>
                                    <AlertIcon />
                                    <HStack w="100%">
                                        <AlertTitle>
                                            This printer is down.
                                        </AlertTitle>
                                        <Spacer />
                                        <Button size="sm">Read more</Button>
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
                                            isAttached
                                            variant="outline"
                                            size="md"
                                        >
                                            <Button
                                                colorScheme="red"
                                                leftIcon={<CloseIcon />}
                                                onClick={() =>
                                                    cancelPrint(activePrint)
                                                }
                                            >
                                                Failed
                                            </Button>
                                            <Button
                                                colorScheme="green"
                                                leftIcon={<CheckIcon />}
                                                onClick={() =>
                                                    completePrint(activePrint)
                                                }
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
                    {/* </Box> */}
                </CardBody>
            </Card>
        </>
    );
}
