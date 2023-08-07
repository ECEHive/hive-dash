import {
    Alert,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    ButtonGroup,
    HStack,
    Heading,
    Icon,
    IconButton,
    Spacer,
    Text,
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import usePrintUpdate from '@/hooks/printing/usePrintUpdate';
import usePrinterParser from '@/hooks/printing/usePrinterParser';
import usePrinterUpdate from '@/hooks/printing/usePrinterUpdate';

import iconSet from '@/util/icons';

import PrintPreview from '@/components/printing/PrintPreview';
import MaintenanceModal from '@/components/printing/maintenance/MaintenanceModal';
import StatusModal from '@/components/printing/maintenance/StatusModal';
import QueueTable from '@/components/printing/printers/QueueTable';

export default function PrinterInfo({ selectedPrinterData }) {
    const { update: printUpdater } = usePrintUpdate();
    const printerUpdater = usePrinterUpdate();

    const { isOpen: isMaintenanceOpen, onOpen: onMaintenanceOpen, onClose: onMaintenanceClose } = useDisclosure();
    const { isOpen: isStatusOpen, onOpen: onStatusOpen, onClose: onStatusClose } = useDisclosure();

    const { currentPrintData: activePrint } = usePrinterParser(selectedPrinterData);

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
                </>
            )}

            <HStack
                flexGrow={1}
                h="auto"
                w="full"
                justify="center"
            >
                <Box
                    h="full"
                    w="full"
                    maxW="4xl"
                    overflow="hidden"
                    px={1}
                >
                    {/* <Card
                    h="100%"
                    flexGrow={1}
                    variant="outline"
                    borderRadius={10}
                >
                    <CardBody> */}
                    {/* <Box w="auto" h="100%" p={2}> */}
                    {selectedPrinterData ? (
                        <>
                            <HStack
                                w="100%"
                                mb={4}
                                alignItems="center"
                            >
                                <Heading
                                    size="lg"
                                    fontWeight="semibold"
                                >
                                    {selectedPrinterData.displayName}
                                </Heading>
                                <Spacer />
                                <ButtonGroup>
                                    <IconButton
                                        icon={<Icon as={iconSet.note} />}
                                        colorScheme="blue"
                                        onClick={onStatusOpen}
                                    />
                                    <IconButton
                                        icon={<Icon as={iconSet.wrench} />}
                                        colorScheme="orange"
                                        onClick={onMaintenanceOpen}
                                    />
                                </ButtonGroup>
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
                                {activePrint && <PrintPreview print={activePrint} />}

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
                            <Text color="secondaryText">select a printer</Text>
                        </VStack>
                    )}
                    {/* </Box> */}
                    {/* </CardBody>
                </Card> */}
                </Box>
            </HStack>
        </>
    );
}
