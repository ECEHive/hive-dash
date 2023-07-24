import { useContext, useEffect, useMemo, useState } from 'react';
import { MdTimeline } from 'react-icons/md';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Card,
    CardBody,
    HStack,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import { InfoIcon, SearchIcon } from '@chakra-ui/icons';

import { useRouter } from 'next/router';

import PrintingContext from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/usePrintParser';

import Layout from '@/layouts/printing/PrintingLayout';

import PrintPreview from '@/components/printing/PrintPreview';
import PrintList from '@/components/printing/find/PrintList';
import Timeline from '@/components/printing/find/Timeline';

export default function FindPrint(props) {
    const { queue } = useContext(PrintingContext);
    const router = useRouter();

    const [selectedPrintData, setSelectedPrintData] = useState(null);
    const { printerData } = usePrintParser(selectedPrintData);

    useEffect(() => {
        if (!selectedPrintData) {
            if (router.query.slug) {
                let data = queue.find((print) => print._id === router.query.slug[0]);
                setSelectedPrintData(data);
            }
        }
    }, [router.query, selectedPrintData, queue]);

    const editBgColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <Box
            w="100%"
            h="100%"
            p={5}
            overflow="auto"
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

                <Card
                    h="100%"
                    flexGrow={1}
                    variant="outline"
                    borderRadius={10}
                    overflow="hidden"
                >
                    <CardBody
                        w="100%"
                        h="100%"
                    >
                        {selectedPrintData ? (
                            <VStack
                                w="100%"
                                h="100%"
                                justify="start"
                                align="start"
                                spacing={3}
                                overflow="auto"
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
                                                This print uses QSR supports, which we will remove for you. Expect it to
                                                be ready one business day later than the print completion date.
                                            </AlertDescription>
                                        </Alert>
                                    </Box>
                                )}

                                <PrintPreview print={selectedPrintData} />

                                {/* timeline */}
                                <HStack
                                    w="100%"
                                    h="auto"
                                    flexGrow={1}
                                    spacing={3}
                                    overflow="auto"
                                >
                                    <Timeline print={selectedPrintData} />
                                </HStack>
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
                    </CardBody>
                </Card>
            </HStack>
        </Box>
    );
}

FindPrint.getLayout = (page) => <Layout>{page}</Layout>;
