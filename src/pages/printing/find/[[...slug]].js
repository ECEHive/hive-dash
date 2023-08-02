import { useEffect, useState } from 'react';

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

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';

import iconSet from '@/util/icons';

import Layout from '@/layouts/printing/PrintingLayout';

import PrintPreview from '@/components/printing/PrintPreview';
import HorizontalTimeline from '@/components/printing/find/HorizontalTimeline';
import PrintList from '@/components/printing/find/PrintList';
import PrintEditorModal from '@/components/printing/printEdit/PrintEditorModal';

export default function FindPrint(props) {
    const { queue } = usePrinting();
    const router = useRouter();

    const [selectedPrintData, setSelectedPrintData] = useState(null);
    const { printerData } = usePrintParser(selectedPrintData);

    const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure();

    useEffect(() => {
        if (!selectedPrintData) {
            if (router.query.slug) {
                let data = queue.find((print) => print._id === router.query.slug[0]);
                setSelectedPrintData(data);
            }
        }
    }, [router.query, selectedPrintData, queue]);

    return (
        <>
            {selectedPrintData && (
                <PrintEditorModal
                    isOpen={isEditorOpen}
                    onClose={onEditorClose}
                    initialData={selectedPrintData}
                />
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
                        setSelectedPrintData={setSelectedPrintData}
                    />

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
                            overflowY="hidden"
                            //pr="260px" //centers in the viewport
                        >
                            {selectedPrintData ? (
                                <>
                                    <VStack
                                        w="100%"
                                        h="100%"
                                        justify="start"
                                        align="start"
                                        spacing={3}
                                        overflow="hidden"
                                        px={1}
                                    >
                                        {printerData?.type === 'stratasys' && (
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
                                        )}

                                        <PrintPreview print={selectedPrintData} />

                                        <HorizontalTimeline print={selectedPrintData} />

                                        {/* tabs */}
                                        <Tabs
                                            w="full"
                                            flexGrow={1}
                                            mt={5}
                                        >
                                            <TabList>
                                                <Tab>Notes</Tab>
                                                <Tab>Actions</Tab>
                                            </TabList>

                                            <TabPanels>
                                                {/* notes */}
                                                <TabPanel>
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
                                                <TabPanel>
                                                    <ButtonGroup>
                                                        <Button
                                                            onClick={onEditorOpen}
                                                            leftIcon={<Icon as={iconSet.minus} />}
                                                            colorScheme="red"
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
                                    h="100%"
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

FindPrint.getLayout = (page) => <Layout>{page}</Layout>;
