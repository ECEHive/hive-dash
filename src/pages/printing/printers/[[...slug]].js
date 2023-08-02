import { useEffect, useState } from 'react';

import { Box, HStack } from '@chakra-ui/react';

import { useRouter } from 'next/router';

import usePrinting from '@/contexts/printing/PrintingContext';

import TopLayout from '@/layouts/printing/PrintingLayout';

import PrinterInfo from '@/components/printing/printers/PrinterInfo';
import PrinterList from '@/components/printing/printers/PrinterList';

export default function Printers(props) {
    const router = useRouter();

    const { printers, queue, printerTypes } = usePrinting();

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
            {/* <CompleteConfirm /> */}
            <Box
                w="100%"
                h="100%"
                overflow="hidden"
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
