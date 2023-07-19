import { useContext, useEffect, useMemo, useState } from 'react';
import { FaPencilAlt, FaPlay, FaWrench } from 'react-icons/fa';

import {
    Badge,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CircularProgress,
    Flex,
    HStack,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Progress,
    Spacer,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    VStack,
    useColorModeValue,
    useDisclosure,
    useToast
} from '@chakra-ui/react';

import { CheckIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';

import { useRouter } from 'next/router';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';
import PrinterContext from '@/contexts/printing/printers/PrinterContext';

import usePrintParser from '@/hooks/usePrintParser';
import usePrintUpdate from '@/hooks/usePrintUpdate';
import usePrinterUpdate from '@/hooks/usePrinterUpdate';

import TopLayout from '@/layouts/printing/PrintingLayout';

import PrintPreview from '@/components/printing/PrintPreview';
import CompleteConfirm from '@/components/printing/printers/CompleteConfirm';
import InfoCard from '@/components/printing/printers/InfoCard';
import PrinterList from '@/components/printing/printers/PrinterList';
import QueueTable from '@/components/printing/printers/QueueTable';

export default function Printers(props) {
    const router = useRouter();

    const { printers, queue, printerTypes } = useContext(PrintingContext);

    const printUpdater = usePrintUpdate();

    const [selectedPrinterData, setSelectedPrinterData] = useState(null);

    const activePrint = useMemo(() => {
        return queue.find(
            (print) => print._id === selectedPrinterData?.currentTray
        );
    }, [queue, selectedPrinterData]);

    useEffect(() => {
        if (!selectedPrinterData) {
            if (router.query.slug) {
                let data = printers.find(
                    (printer) => printer.id === router.query.slug[0]
                );
                setSelectedPrinterData(data);
            }
        }
    }, [router.query, selectedPrinterData, printers]);

    function cancelPrint(printData) {
        let data = {
            ...printData,
            printing: false,
            events: [
                {
                    type: 'failed',
                    timestamp: dayjs.utc()
                },
                ...printData.events
            ]
        };
        printUpdater(printData._id, data);
    }

    function completePrint(printData) {
        let data = {
            ...printData,
            printing: false,
            completed: true,
            events: [
                {
                    type: 'completed',
                    timestamp: dayjs.utc()
                },
                ...printData.events
            ]
        };
        printUpdater(printData._id, data);
    }

    return (
        <>
            {/* <CompleteConfirm /> */}
            <Box w="100%" h="100%" overflow="auto" p={5}>
                <HStack
                    w="100%"
                    h="100%"
                    spacing={4}
                    alignItems="flex-start"
                    justifyContent="flex-start"
                >
                    <PrinterList
                        selectedPrinter={selectedPrinterData}
                        setSelectedPrinter={setSelectedPrinterData}
                    />

                    <Card
                        h="100%"
                        flexGrow={1}
                        variant="filled"
                        borderRadius={10}
                    >
                        <CardBody>
                            <HStack w="100%" mb={4} alignItems="center">
                                <Heading size="lg">
                                    {selectedPrinterData?.displayName}
                                </Heading>
                                <Spacer />
                                <IconButton
                                    icon={<FaWrench />}
                                    colorScheme="orange"
                                    isDisabled
                                />
                            </HStack>
                            <VStack
                                alignItems="flex-start"
                                h="auto"
                                w="100%"
                                spacing={4}
                                overflow="auto"
                            >
                                {/* current print */}
                                {activePrint && (
                                    <PrintPreview
                                        print={activePrint}
                                        actions={
                                            activePrint.printing && (
                                                <ButtonGroup
                                                    isAttached
                                                    variant="outline"
                                                    size="md"
                                                >
                                                    <Button
                                                        colorScheme="red"
                                                        leftIcon={<CloseIcon />}
                                                        onClick={() =>
                                                            cancelPrint(
                                                                activePrint
                                                            )
                                                        }
                                                    >
                                                        Failed
                                                    </Button>
                                                    <Button
                                                        colorScheme="green"
                                                        leftIcon={<CheckIcon />}
                                                        onClick={() =>
                                                            completePrint(
                                                                activePrint
                                                            )
                                                        }
                                                    >
                                                        Completed
                                                    </Button>
                                                </ButtonGroup>
                                            )
                                        }
                                    />
                                )}

                                {/* queue */}
                                <QueueTable
                                    activePrint={activePrint}
                                    selectedPrinterData={selectedPrinterData}
                                />
                            </VStack>
                        </CardBody>
                    </Card>
                </HStack>
            </Box>
        </>
    );
}

Printers.getLayout = (page) => <TopLayout>{page}</TopLayout>;
