import { useContext, useEffect, useMemo, useState } from 'react';

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

import Head from 'next/head';
import { useRouter } from 'next/router';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

import usePrintUpdate from '@/hooks/usePrintUpdate';
import usePrinterUpdate from '@/hooks/usePrinterUpdate';

import SquareLogo from '@/assets/square_logo.png';

import TopLayout from '@/layouts/printing/PrintingLayout';

import PrintPreview from '@/components/printing/PrintPreview';
import MaintenanceModal from '@/components/printing/maintenance/MaintenanceModal';
import PrinterInfo from '@/components/printing/printers/PrinterInfo';
import PrinterList from '@/components/printing/printers/PrinterList';
import QueueTable from '@/components/printing/printers/QueueTable';

export default function Printers(props) {
    const router = useRouter();

    const { printers, queue, printerTypes } = useContext(PrintingContext);

    const [selectedPrinterData, setSelectedPrinterData] = useState(null);

    useEffect(() => {
        if (!selectedPrinterData) {
            if (router.query.slug) {
                let data = printers.find((printer) => printer.id === router.query.slug[0]);
                setSelectedPrinterData(data);
            }
        }
    }, [router.query, selectedPrinterData, printers]);

    useEffect(() => {
        setSelectedPrinterData((prev) => {
            if (!prev) return null;
            return printers.find((printer) => printer.id === prev.id);
        });
    }, [printers]);

    return (
        <>
            <Head>
                {selectedPrinterData && (
                    <>
                        <title>{selectedPrinterData.displayName} @ The HIVE</title>

                        <meta
                            name="og:site_name"
                            content={'The HIVE'}
                        />
                        <meta
                            name="og:title"
                            content={`${selectedPrinterData.displayName} @ The HIVE`}
                        />
                        <meta
                            name="og:url"
                            content={`https://hive.utrgv.edu/printing/printers/${selectedPrinterData.id}`}
                        />
                        <meta
                            name="og:type"
                            content="website"
                        />
                        <meta
                            name="og:image"
                            content={SquareLogo}
                        />
                        <meta
                            name="og:description"
                            content={`${selectedPrinterData.displayName} is a 3D printer at The HIVE makerspace.`}
                        />
                    </>
                )}
            </Head>
            {/* <CompleteConfirm /> */}
            <Box
                w="100%"
                h="100%"
                overflow="auto"
                p={5}
            >
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

                    {/* {selectedPrinterData && ( */}
                    <PrinterInfo selectedPrinterData={selectedPrinterData} />
                    {/* )} */}
                </HStack>
            </Box>
        </>
    );
}

Printers.getLayout = (page) => <TopLayout>{page}</TopLayout>;
