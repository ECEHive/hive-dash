import { useEffect, useState } from 'react';

import { Box, HStack } from '@chakra-ui/react';

import { useRouter } from 'next/router';

import usePrinting from '@/contexts/printing/PrintingContext';

import GlobalLayout from '@/layouts/GlobalLayout';
import Layout from '@/layouts/PrintingLayout';

import PrinterInfo from '@/components/printing/printers/PrinterInfo';
import PrinterList from '@/components/printing/printers/PrinterList';

export default function Printers(props) {
    const router = useRouter();

    const { printers, queue, printerTypes } = usePrinting();

    const [selectedPrinterData, setSelectedPrinterData] = useState(null);

    useEffect(() => {
        if (router.query.slug) {
            let data = printers.find((printer) => printer.id === router.query.slug[0]);
            setSelectedPrinterData(data);
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
            {/* <CompleteConfirm /> */}
            <Box
                w="full"
                h="full"
                overflow="hidden"
            >
                <HStack
                    w="100%"
                    h="100%"
                    spacing={0}
                    alignItems="flex-start"
                    justifyContent="flex-start"
                >
                    <PrinterList
                        selectedPrinter={selectedPrinterData}
                        setSelectedPrinter={setSelectedPrinterData}
                    />

                    {/* {selectedPrinterData && ( */}
                    <HStack
                        w="auto"
                        h="full"
                        flexGrow={1}
                        overflow="auto"
                        justify="center"
                    >
                        <PrinterInfo selectedPrinterData={selectedPrinterData} />
                    </HStack>
                    {/* )} */}
                </HStack>
            </Box>
        </>
    );
}

Printers.getLayout = (page) => (
    <GlobalLayout>
        <Layout>{page}</Layout>
    </GlobalLayout>
);
