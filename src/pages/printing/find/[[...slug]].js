import { useContext, useEffect, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    ButtonGroup,
    HStack,
    Text,
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import { useRouter } from 'next/router';

import PrintingContext from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';

import Layout from '@/layouts/printing/PrintingLayout';

import PrintPreview from '@/components/printing/PrintPreview';
import HorizontalTimeline from '@/components/printing/find/HorizontalTimeline';
import PrintList from '@/components/printing/find/PrintList';
import PrintEditorModal from '@/components/printing/printEdit/PrintEditorModal';

export default function FindPrint(props) {
    const { queue } = useContext(PrintingContext);
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
                            maxW="1000px"
                            overflow="hidden"
                            //pr="260px" //centers in the viewport
                        >
                            {selectedPrintData ? (
                                <VStack
                                    w="100%"
                                    h="100%"
                                    justify="start"
                                    align="start"
                                    spacing={3}
                                    overflow="hidden"
                                >
                                    {printerData.type === 'stratasys' && (
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
                                                    This print uses QSR supports, which we will remove for you. Expect
                                                    it to be ready one business day later than the print completion
                                                    date.
                                                </AlertDescription>
                                            </Alert>
                                        </Box>
                                    )}

                                    <PrintPreview print={selectedPrintData} />

                                    {/* timeline */}
                                    <VStack
                                        w="100%"
                                        h="auto"
                                        flexGrow={1}
                                        spacing={3}
                                        overflow="auto"
                                        align="start"
                                    >
                                        {/* <Timeline print={selectedPrintData} /> */}
                                        <HorizontalTimeline print={selectedPrintData} />

                                        <ButtonGroup>
                                            <Button onClick={onEditorOpen}>Advanced edit</Button>
                                        </ButtonGroup>
                                    </VStack>
                                </VStack>
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
