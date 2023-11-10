import { useEffect, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    ButtonGroup,
    CircularProgress,
    Divider,
    Flex,
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
    Tooltip,
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
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

import PrintInfoFields from '../PrintInfoFields';
import ModelPreview from '../preview/ModelPreview';

export default function PrinterInfo({ selectedPrinterData }) {
    const { update: printUpdater } = usePrintUpdate();
    const printerUpdater = usePrinterUpdate();

    const [tabIndex, setTabIndex] = useState(0);

    const { isOpen: isMaintenanceOpen, onOpen: onMaintenanceOpen, onClose: onMaintenanceClose } = useDisclosure();

    const { currentPrintData: activePrint, printerTypeData } = usePrinterParser(selectedPrinterData);

    const { betterPrintData, printerData } = usePrintParser(activePrint);
    const {
        progressBarColor,
        progressMessage,
        progress,
        progressCircleColor,
        timeLeft,
        timeLeftHumanized,
        timeLeftHumanizedDetailed
    } = usePrintProgress(activePrint);
    const { roleId } = useAuth();

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

            <Flex
                w="full"
                h="full"
                overflow="auto"
                direction="column"
                align="center"
            >
                {selectedPrinterData ? (
                    <>
                        <VStack
                            spacing={3}
                            h="auto"
                            w="full"
                            align="start"
                            justify="start"
                            maxW="6xl"
                            p={5}
                        >
                            <HStack
                                w="full"
                                h="auto"
                                alignItems="center"
                                position="relative"
                                spacing={5}
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
                                {/* <Tag
                                size="lg"
                                colorScheme={printerTypeData.color}
                            >
                                <TagLabel>{printerTypeData.displayName}</TagLabel>
                            </Tag> */}
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
                                spacing={3}
                                overflow="hidden"
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
                                        {/* <Box
                                        w="100%"
                                        h="auto"
                                    >
                                        <Alert
                                            status="warning"
                                            borderRadius={5}
                                        >
                                            <AlertIcon />

                                            <AlertDescription w="auto">
                                                This print was autogenerated because no print with a matching name was
                                                found in the database. Either check and input the print details or
                                                cancel the print on the printer.
                                            </AlertDescription>
                                        </Alert>
                                    </Box> */}

                                        <HStack
                                            w="full"
                                            h="full"
                                            align="start"
                                            bgColor="chakra-body-bg"
                                            borderRadius={10}
                                        >
                                            <VStack
                                                w="full"
                                                align="start"
                                                spacing={5}
                                                minH="150px"
                                            >
                                                <VStack
                                                    align="start"
                                                    spacing={2}
                                                >
                                                    <HStack>
                                                        <Heading
                                                            size="lg"
                                                            fontWeight="semibold"
                                                            as={Link}
                                                            href={`/printing/prints/${betterPrintData._id}`}
                                                            overflowWrap="anywhere"
                                                        >
                                                            {betterPrintData.trayName}
                                                        </Heading>
                                                        {betterPrintData.linkedPrintId?.length > 0 && (
                                                            <Tooltip label="Linked to printer">
                                                                <span>
                                                                    <Icon
                                                                        fontSize="lg"
                                                                        color="secondaryTextAlt"
                                                                        as={iconSet.link}
                                                                    />
                                                                </span>
                                                            </Tooltip>
                                                        )}
                                                    </HStack>
                                                    <HStack>
                                                        <PrintInfoFields
                                                            print={betterPrintData}
                                                            fields={[
                                                                'material',
                                                                'materialAmount',
                                                                'estTime',
                                                                'queuedAt'
                                                            ]}
                                                        />
                                                    </HStack>
                                                </VStack>

                                                <Spacer />

                                                <HStack
                                                    w="full"
                                                    h="full"
                                                    align="end"
                                                >
                                                    <HStack align="center">
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
                                                            <Text fontWeight="medium">
                                                                {progressMessage === 'printing'
                                                                    ? timeLeft
                                                                    : progressMessage}
                                                            </Text>
                                                        </HStack>
                                                        <Icon
                                                            fontSize="sm"
                                                            as={iconSet.dot}
                                                        />
                                                        <Text>Queued by {activePrint.queuedBy}</Text>
                                                    </HStack>

                                                    <Spacer />

                                                    {/* {betterPrintData.state === PrintStates.PRINTING && (
                                                        <ButtonGroup
                                                            size="sm"
                                                            variant="solid"
                                                        >
                                                            <Button
                                                                colorScheme="green"
                                                                leftIcon={<Icon as={iconSet.check} />}
                                                            >
                                                                Completed
                                                            </Button>
                                                            <Button
                                                                colorScheme="red"
                                                                leftIcon={<Icon as={iconSet.x} />}
                                                            >
                                                                Failed
                                                            </Button>
                                                        </ButtonGroup>
                                                    )} */}
                                                </HStack>
                                            </VStack>

                                            <Spacer />

                                            {activePrint?.stlFiles?.length > 0 && (
                                                <Box
                                                    w="auto"
                                                    minH="150px"
                                                    bgColor="chakra-subtle-bg"
                                                    borderRadius={10}
                                                >
                                                    <ModelPreview
                                                        printData={activePrint}
                                                        w="150px"
                                                        h="150px"
                                                    />
                                                </Box>
                                            )}
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
                                                <Text color={'secondaryText'}>
                                                    No notes are attached to this printer.
                                                </Text>
                                            )}
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </VStack>
                        </VStack>
                    </>
                ) : (
                    <VStack
                        minH="full"
                        w="100%"
                        justify="center"
                    >
                        <Text color="secondaryText">select a printer</Text>
                    </VStack>
                )}
                {/* </Box> */}
                {/* </CardBody>
                </Card> */}
            </Flex>
        </>
    );
}
