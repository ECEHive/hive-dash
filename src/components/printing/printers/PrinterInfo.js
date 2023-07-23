import { FaWrench } from 'react-icons/fa';

import {
    Button,
    ButtonGroup,
    Card,
    CardBody,
    HStack,
    Heading,
    IconButton,
    Spacer,
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

import dayjs from '@/lib/time';

import usePrintUpdate from '@/hooks/usePrintUpdate';
import usePrinterParser from '@/hooks/usePrinterParser';
import usePrinterUpdate from '@/hooks/usePrinterUpdate';

import PrintPreview from '@/components/printing/PrintPreview';
import QueueTable from '@/components/printing/printers/QueueTable';

import MaintenanceModal from './maintenance/MaintenanceModal';

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
            <MaintenanceModal open={isOpen} onClose={onClose} />
            <Card h="100%" flexGrow={1} variant="filled" borderRadius={10}>
                <CardBody>
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
                </CardBody>
            </Card>
        </>
    );
}
