import { useState, useEffect, useContext, useMemo } from 'react';
import {
    Box,
    HStack,
    InputRightAddon,
    VStack,
    InputGroup,
    InputLeftElement,
    Input,
    Text,
    Card,
    CardBody,
    Heading,
    Badge,
    Spacer,
    Button,
    CircularProgress,
    Tooltip,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useColorModeValue
} from '@chakra-ui/react';
import { InfoIcon, SearchIcon } from '@chakra-ui/icons';

import Layout from '@/layouts/printing/PrintingLayout';
import PrintPreview from '@/components/printing/PrintPreview';
import TimelineEvent from '@/components/printing/find/TimelineEvent';
import PrintList from '@/components/printing/find/PrintList';
import Timeline from '@/components/printing/find/Timeline';
import usePrintParser from '@/hooks/usePrintParser';
import PrintAlert from '@/components/printing/find/PrintAlert';
import { useRouter } from 'next/router';
import PrintingContext from '@/contexts/printing/PrintingContext';

export default function FindPrint(props) {
    const { queue } = useContext(PrintingContext);
    const router = useRouter();

    const [selectedPrintData, setSelectedPrintData] = useState(null);

    useEffect(() => {
        if (!selectedPrintData) {
            if (router.query.slug) {
                let data = queue.find(
                    (print) => print._id === router.query.slug[0]
                );
                setSelectedPrintData(data);
            }
        }
    }, [router.query, selectedPrintData, queue]);

    const editBgColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <Box w="100%" h="100%" p={5} overflow="auto">
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
                    variant="filled"
                    borderRadius={10}
                    overflow="hidden"
                >
                    <CardBody w="100%" h="100%">
                        {selectedPrintData && (
                            <VStack
                                w="100%"
                                h="100%"
                                justify="start"
                                align="start"
                                spacing={3}
                                overflow="auto"
                            >
                                <PrintAlert print={selectedPrintData} />

                                <PrintPreview print={selectedPrintData} />

                                {/* timeline */}
                                <HStack
                                    w="100%"
                                    h="auto"
                                    flexGrow={1}
                                    spacing={3}
                                    overflow="hidden"
                                >
                                    <Timeline print={selectedPrintData} />

                                    <Card
                                        w="100%"
                                        h="100%"
                                        variant="filled"
                                        bgColor={editBgColor}
                                    >
                                        <CardBody>haiii</CardBody>
                                    </Card>
                                </HStack>
                            </VStack>
                        )}
                    </CardBody>
                </Card>
            </HStack>
        </Box>
    );
}

FindPrint.getLayout = (page) => <Layout>{page}</Layout>;
