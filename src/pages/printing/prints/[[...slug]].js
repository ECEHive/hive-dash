import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    ButtonGroup,
    Divider,
    HStack,
    Heading,
    Icon,
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
import { useRouter } from 'next/router';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';
import usePrintUpdate from '@/hooks/printing/usePrintUpdate';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

import GlobalLayout from '@/layouts/GlobalLayout';
import Layout from '@/layouts/PrintingLayout';

import PrintEditorModal from '@/components/printing/printEdit/PrintEditorModal';
import UpdateModal from '@/components/printing/printers/UpdateModal';
import PrintList from '@/components/printing/prints/PrintList';
import Timeline from '@/components/printing/prints/Timeline';

export default function FindPrint(props) {
    const { queue } = usePrinting();
    const router = useRouter();

    const [selectedPrintId, setSelectedPrintId] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    const selectedPrintData = useMemo(() => {
        if (!selectedPrintId) return null;
        return queue.find((print) => print._id === selectedPrintId);
    }, [selectedPrintId, queue]);

    const { betterPrintData, printerData } = usePrintParser(selectedPrintData);

    const {
        progressBarColor,
        progressMessage,
        progress,
        progressCircleColor,
        progressMessageColor,
        timeLeftHumanized,
        timeLeftHumanizedDetailed
    } = usePrintProgress(selectedPrintData);

    const [cancelEventData, setCancelEventData] = useState(null);

    const { update: printUpdater } = usePrintUpdate();

    const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure();
    const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();

    useEffect(() => {
        if (router.query.slug) {
            setTabIndex(0);
            setSelectedPrintId(router.query.slug[0]);
        }
    }, [router.query, queue]);

    const cancelPrint = useCallback(() => {
        setCancelEventData({
            type: PrintStates.CANCELED,
            notes: '',
            timestamp: dayjs.utc().toISOString()
        });
        onCancelOpen();
    }, [onCancelOpen]);

    const confirmCancel = useCallback(
        (event) => {
            let data = {
                ...selectedPrintData,
                state: PrintStates.CANCELED,
                events: [event, ...selectedPrintData.events]
            };
            printUpdater(selectedPrintData._id, data);
            onCancelClose();
        },
        [printUpdater, onCancelClose, selectedPrintData]
    );

    const dataFields = useMemo(() => {
        return [
            {
                label: 'Printer',
                icon: iconSet.printer,
                value: printerData?.displayName || betterPrintData?.printer
            },
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
    }, [printerData, betterPrintData]);

    return (
        <>
            {selectedPrintData && (
                <>
                    <UpdateModal
                        isOpen={isCancelOpen}
                        onClose={onCancelClose}
                        eventData={cancelEventData}
                        save={(event) => {
                            confirmCancel(event);
                        }}
                    />
                    <PrintEditorModal
                        isOpen={isEditorOpen}
                        onClose={onEditorClose}
                        initialData={selectedPrintData}
                    />
                </>
            )}
            <Box
                w="100%"
                h="100%"
                p={5}
                overflow="hidden"
            >
                <HStack
                    w="100%"
                    h="100%"
                    spacing={4}
                    alignItems="flex-start"
                    justifyContent="flex-start"
                >
                    <PrintList
                        selectedPrintData={selectedPrintData}
                        setSelectedPrintId={setSelectedPrintId}
                    />

                    <HStack
                        flexGrow={1}
                        h="full"
                        justify="center"
                        overflow="auto"
                        align="start"
                    >
                        <Box
                            h="auto"
                            w="full"
                            maxW="4xl"
                            px={1}
                        >
                            {selectedPrintData ? (
                                <>
                                    <VStack
                                        position="relative"
                                        w="100%"
                                        h="full"
                                        justify="center"
                                        align="start"
                                        spacing={3}
                                        px={1}
                                    >
                                        {selectedPrintData.state === PrintStates.CANCELED && (
                                            <Box
                                                w="100%"
                                                h="auto"
                                            >
                                                <Alert
                                                    status="error"
                                                    borderRadius={5}
                                                >
                                                    <AlertIcon />
                                                    <AlertDescription>This print has been canceled</AlertDescription>
                                                </Alert>
                                            </Box>
                                        )}

                                        {/* {printerData?.type === 'stratasys' &&
                                        selectedPrintData.state !== PrintStates.CANCELED ? (
                                            <Box
                                                w="100%"
                                                h="auto"
                                            >
                                                <Alert
                                                    status="warning"
                                                    borderRadius={5}
                                                >
                                                    <AlertIcon />
                                                    <AlertDescription>
                                                        This print uses QSR supports, which we will remove for you.
                                                        Expect it to be ready one business day later than the print
                                                        completion date.
                                                    </AlertDescription>
                                                </Alert>
                                            </Box>
                                        ) : null} */}

                                        <HStack
                                            w="full"
                                            position="relative"
                                            overflow="hidden"
                                        >
                                            {/* <CircularProgress
                                                size={16}
                                                thickness={6}
                                                value={progress}
                                                color={progressCircleColor}
                                                trackColor="progressTrackAlt"
                                            /> */}
                                            <VStack
                                                align="start"
                                                justify="start"
                                                spacing={3}
                                            >
                                                <Heading
                                                    size="lg"
                                                    fontWeight="semibold"
                                                >
                                                    {betterPrintData.trayName}
                                                </Heading>
                                                <HStack
                                                    w="auto"
                                                    h="auto"
                                                    align="center"
                                                    justify="start"
                                                    pb={2}
                                                    spacing={3}
                                                    overflow="auto"
                                                    whiteSpace="nowrap"
                                                    // borderRight={actions && '1px'}
                                                    // borderRightColor={actions && 'chakra-border-color'}
                                                >
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
                                                                            fontSize="lg"
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
                                                {/* <HStack
                                                    fontSize="md"
                                                    color="secondaryTextAlt"
                                                    spacing={2}
                                                >
                                                    <Icon as={iconSet.clock} />
                                                    <Text fontSize="sm">{timeLeftHumanizedDetailed}</Text>
                                                </HStack> */}
                                            </VStack>
                                            <Spacer />
                                            <Image
                                                src={betterPrintData.preview}
                                                alt="print preview"
                                                width={512}
                                                height={512}
                                                style={{
                                                    width: 'auto',
                                                    height: '80px'
                                                }}
                                            />
                                        </HStack>

                                        <Divider />

                                        <Timeline print={selectedPrintData} />

                                        {/* tabs */}
                                        <Tabs
                                            w="full"
                                            flexGrow={1}
                                            index={tabIndex}
                                            onChange={(index) => {
                                                setTabIndex(index);
                                            }}
                                        >
                                            <TabList>
                                                <Tab>Notes</Tab>
                                                <Tab>Actions</Tab>
                                            </TabList>

                                            <TabPanels>
                                                {/* notes */}
                                                <TabPanel px={0}>
                                                    {selectedPrintData.notes?.length > 0 ? (
                                                        <ReactMarkdown
                                                            components={ChakraUIRenderer()}
                                                            skipHtml
                                                        >
                                                            {selectedPrintData.notes}
                                                        </ReactMarkdown>
                                                    ) : (
                                                        <Text color={'secondaryText'}>
                                                            No notes are attached to this print.
                                                        </Text>
                                                    )}
                                                </TabPanel>
                                                <TabPanel px={0}>
                                                    <ButtonGroup>
                                                        <Button
                                                            onClick={cancelPrint}
                                                            leftIcon={<Icon as={iconSet.minus} />}
                                                            colorScheme="red"
                                                            isDisabled={
                                                                selectedPrintData.state === PrintStates.CANCELED ||
                                                                selectedPrintData.state === PrintStates.COMPLETED
                                                            }
                                                        >
                                                            Cancel print
                                                        </Button>
                                                        <Button
                                                            onClick={onEditorOpen}
                                                            leftIcon={<Icon as={iconSet.pencil} />}
                                                            colorScheme="orange"
                                                        >
                                                            Edit print
                                                        </Button>
                                                    </ButtonGroup>
                                                </TabPanel>
                                            </TabPanels>
                                        </Tabs>
                                    </VStack>
                                </>
                            ) : (
                                <VStack
                                    minH="100%"
                                    w="100%"
                                    justify="center"
                                >
                                    <Text color="gray.400">select a print</Text>
                                </VStack>
                            )}
                            {/* </CardBody>
                        </Card> */}
                        </Box>
                    </HStack>
                </HStack>
            </Box>
        </>
    );
}

FindPrint.getLayout = (page) => (
    <GlobalLayout>
        <Layout>{page}</Layout>
    </GlobalLayout>
);
