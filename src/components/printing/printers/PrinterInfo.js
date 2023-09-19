import { useEffect, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    ButtonGroup,
    HStack,
    Heading,
    Icon,
    IconButton,
    Spacer,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';

import usePrintUpdate from '@/hooks/printing/usePrintUpdate';
import usePrinterParser from '@/hooks/printing/usePrinterParser';
import usePrinterUpdate from '@/hooks/printing/usePrinterUpdate';

import iconSet from '@/util/icons';

import PrintPreview from '@/components/printing/PrintPreview';
import MaintenanceModal from '@/components/printing/maintenance/MaintenanceModal';
import QueueTable from '@/components/printing/printers/QueueTable';

export default function PrinterInfo({ selectedPrinterData }) {
    const { update: printUpdater } = usePrintUpdate();
    const printerUpdater = usePrinterUpdate();

    const [tabIndex, setTabIndex] = useState(0);

    const { isOpen: isMaintenanceOpen, onOpen: onMaintenanceOpen, onClose: onMaintenanceClose } = useDisclosure();

    const { currentPrintData: activePrint } = usePrinterParser(selectedPrinterData);

    useEffect(() => {
        setTabIndex(0);
    }, [selectedPrinterData]);

    return (
        <>
            {selectedPrinterData && (
                <>
                    <MaintenanceModal
                        isOpen={isMaintenanceOpen}
                        onClose={onMaintenanceClose}
                        printerData={selectedPrinterData}
                    />
                </>
            )}

            <Box
                h="full"
                w="full"
                maxW="4xl"
                overflow="hidden"
                p={5}
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
                                            <AlertDescription>
                                                This printer is down. Check the notes tab for more details
                                            </AlertDescription>
                                            {/* <Spacer />
                                                <Button
                                                    size="sm"
                                                    onClick={onStatusOpen}
                                                >
                                                    Read more
                                                </Button> */}
                                        </HStack>
                                    </Alert>
                                </Box>
                            )}

                            {/* current print */}
                            {activePrint && <PrintPreview print={activePrint} />}

                            <Tabs
                                w="full"
                                flexGrow={1}
                                index={tabIndex}
                                onChange={(index) => {
                                    setTabIndex(index);
                                }}
                            >
                                <TabList>
                                    <Tab>Queue</Tab>
                                    <Tab>Printer notes</Tab>
                                </TabList>

                                <TabPanels w="full">
                                    {/* notes */}
                                    <TabPanel px={0}>
                                        <QueueTable
                                            activePrint={activePrint}
                                            selectedPrinterData={selectedPrinterData}
                                        />
                                    </TabPanel>
                                    <TabPanel px={0}>
                                        {selectedPrinterData.maintenance.notes?.length > 0 ? (
                                            <ReactMarkdown
                                                components={ChakraUIRenderer()}
                                                skipHtml
                                            >
                                                {selectedPrinterData.maintenance.notes}
                                            </ReactMarkdown>
                                        ) : (
                                            <Text color={'secondaryText'}>No notes are attached to this print.</Text>
                                        )}
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
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
        </>
    );
}
