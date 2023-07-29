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

import usePrintUpdate from '@/hooks/printing/usePrintUpdate';
import usePrinterParser from '@/hooks/printing/usePrinterParser';
import usePrinterUpdate from '@/hooks/printing/usePrinterUpdate';
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
                h="full"
                justify="center"
                overflow="hidden"
            >
                <Box
                    h="full"
                    w="full"
                    maxW="4xl"
                    overflow="hidden"
                    //pr="260px" //centers in the viewport
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
                            <Text color={secondary}>select a printer</Text>
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
