import { useEffect, useMemo, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    ButtonGroup,
    CircularProgress,
    Divider,
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
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import { useAuth } from '@/contexts/AuthContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';
import usePrintUpdate from '@/hooks/printing/usePrintUpdate';
import usePrinterParser from '@/hooks/printing/usePrinterParser';
import usePrinterUpdate from '@/hooks/printing/usePrinterUpdate';

import iconSet from '@/util/icons';
import { PITypes } from '@/util/roles';

import MaintenanceModal from '@/components/printing/maintenance/MaintenanceModal';
import QueueTable from '@/components/printing/printers/QueueTable';

export default function PrinterInfo({ selectedPrinterData }) {
    const { update: printUpdater } = usePrintUpdate();
    const printerUpdater = usePrinterUpdate();

    const [tabIndex, setTabIndex] = useState(0);

    const { isOpen: isMaintenanceOpen, onOpen: onMaintenanceOpen, onClose: onMaintenanceClose } = useDisclosure();

    const { currentPrintData: activePrint } = usePrinterParser(selectedPrinterData);

    const { betterPrintData, printerData } = usePrintParser(activePrint);
    const {
        progressBarColor,
        progressMessage,
        progress,
        progressCircleColor,
        progressMessageColor,
        timeLeftHumanized,
        timeLeftHumanizedDetailed
    } = usePrintProgress(activePrint);
    const { roleId } = useAuth();

    const dataFields = useMemo(() => {
        return [
            {
                label: 'Material',
                icon: iconSet.material,
                value: betterPrintData?.materialType
            },
            {
                label: 'Est. material',
                icon: iconSet.materialAmount,
                value: betterPrintData?.materialUsage,
                suffix: betterPrintData?.materialSymbol
            },
            {
                label: 'Est. time',
                icon: iconSet.clock,
                value: betterPrintData?.estTimeFormatted
            }
        ];
    }, [betterPrintData]);

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
                overflow="auto"
                p={5}
            >
                {selectedPrinterData ? (
                    <>
                        <HStack
                            w="100%"
                            mb={4}
                            alignItems="center"
                        >
                            <VStack>
                                <Heading
                                    size="lg"
                                    fontWeight="semibold"
                                >
                                    {selectedPrinterData.displayName}
                                </Heading>
                                {/* <HStack w="full">
                                    <Icon as={iconSet.play} />
                                    <Text
                                        fontSize="md"
                                        fontWeight="medium"
                                    >
                                        Printing
                                    </Text>
                                </HStack> */}
                            </VStack>
                            <Spacer />
                            {roleId >= PITypes.PI && (
                                <ButtonGroup>
                                    <IconButton
                                        icon={<Icon as={iconSet.wrench} />}
                                        colorScheme="orange"
                                        variant="ghost"
                                        onClick={onMaintenanceOpen}
                                    />
                                </ButtonGroup>
                            )}
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

                            <Divider />

                            {/* current print */}
                            {activePrint && (
                                <>
                                    <HStack
                                        w="full"
                                        h="full"
                                        align="start"
                                        bgColor="chakra-body-bg"
                                        borderRadius={10}
                                    >
                                        <VStack
                                            align="start"
                                            spacing={5}
                                            minH="150px"
                                        >
                                            <VStack
                                                align="start"
                                                spacing={2}
                                            >
                                                <Heading
                                                    size="lg"
                                                    fontWeight="semibold"
                                                    as={Link}
                                                    href={`/printing/prints/${betterPrintData._id}`}
                                                >
                                                    {betterPrintData.trayName}
                                                </Heading>
                                                <HStack>
                                                    {dataFields.map((field, i) => {
                                                        return (
                                                            <>
                                                                <VStack
                                                                    spacing={1}
                                                                    align="start"
                                                                >
                                                                    <HStack
                                                                        alignItems="center"
                                                                        spacing={2}
                                                                        color="secondaryText"
                                                                    >
                                                                        <Icon
                                                                            fontSize="md"
                                                                            as={field.icon}
                                                                        />
                                                                        <HStack
                                                                            align="end"
                                                                            spacing={1}
                                                                            height="full"
                                                                        >
                                                                            <Text
                                                                                fontSize="xl"
                                                                                fontWeight="medium"
                                                                                lineHeight={1}
                                                                            >
                                                                                {field.value}
                                                                            </Text>
                                                                            {field.suffix && (
                                                                                <Text fontSize="sm">
                                                                                    {field.suffix}
                                                                                </Text>
                                                                            )}
                                                                        </HStack>
                                                                    </HStack>
                                                                </VStack>
                                                                {i < dataFields.length - 1 && (
                                                                    <Icon
                                                                        color="secondaryText"
                                                                        fontSize="sm"
                                                                        as={iconSet.dot}
                                                                    />
                                                                )}
                                                            </>
                                                        );
                                                    })}
                                                </HStack>
                                            </VStack>

                                            <Spacer />

                                            <HStack
                                                w="auto"
                                                h="full"
                                            >
                                                <HStack
                                                    w="auto"
                                                    h="full"
                                                >
                                                    <CircularProgress
                                                        size={6}
                                                        thickness={6}
                                                        value={progress}
                                                        color={progressCircleColor}
                                                        trackColor="chakra-subtle-bg"
                                                    />
                                                    <Text fontWeight="medium">{progressMessage}</Text>
                                                </HStack>
                                                <Icon
                                                    fontSize="sm"
                                                    as={iconSet.dot}
                                                />
                                                <Text>Queued by {activePrint.queuedBy}</Text>
                                            </HStack>
                                        </VStack>

                                        <Spacer />

                                        <Box
                                            w="auto"
                                            h="150px"
                                            bgColor="chakra-subtle-bg"
                                            borderRadius={5}
                                        >
                                            <Image
                                                src={
                                                    betterPrintData?.preview ||
                                                    'https://firebasestorage.googleapis.com/v0/b/hive-af57a.appspot.com/o/previews%2FPI_Colin_Hartigan_bruh10000?alt=media&token=21d28026-6320-4b9c-9d4a-f8ce304b7bb3'
                                                }
                                                alt="preview"
                                                width={512}
                                                height={512}
                                                style={{
                                                    maxHeight: '150px',
                                                    width: 'auto'
                                                }}
                                            />
                                        </Box>
                                    </HStack>
                                </>
                            )}

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
