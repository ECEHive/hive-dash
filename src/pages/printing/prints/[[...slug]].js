import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    ButtonGroup,
    HStack,
    Icon,
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
import { useRouter } from 'next/router';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintUpdate from '@/hooks/printing/usePrintUpdate';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

import GlobalLayout from '@/layouts/GlobalLayout';
import Layout from '@/layouts/printing/PrintingLayout';

import PrintPreview from '@/components/printing/PrintPreview';
import PrintEditorModal from '@/components/printing/printEdit/PrintEditorModal';
import UpdateModal from '@/components/printing/printers/UpdateModal';
import HorizontalTimeline from '@/components/printing/prints/HorizontalTimeline';
import PrintList from '@/components/printing/prints/PrintList';

export default function FindPrint(props) {
    const { queue } = usePrinting();
    const router = useRouter();

    const [selectedPrintId, setSelectedPrintId] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    const selectedPrintData = useMemo(() => {
        if (!selectedPrintId) return null;
        return queue.find((print) => print._id === selectedPrintId);
    }, [selectedPrintId, queue]);

    const { printerData } = usePrintParser(selectedPrintData);

    const [cancelEventData, setCancelEventData] = useState(null);

    const { update: printUpdater } = usePrintUpdate();

    const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure();
    const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();

    useEffect(() => {
        if (router.query.slug) {
            setTabIndex(0);
            setSelectedPrintId(router.query.slug[0]);
        }
    }, [router.query, selectedPrintData, queue]);

    useEffect(() => {}, [queue]);

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
                                        w="100%"
                                        h="full"
                                        justify="start"
                                        align="start"
                                        spacing={3}
                                        px={1}
                                    >
                                        {printerData?.type === 'stratasys' &&
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
                                        ) : null}

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

                                        <PrintPreview print={selectedPrintData} />

                                        <HorizontalTimeline print={selectedPrintData} />

                                        {/* tabs */}
                                        <Tabs
                                            w="full"
                                            flexGrow={1}
                                            mt={5}
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
