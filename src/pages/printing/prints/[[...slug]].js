import { useEffect, useMemo, useState } from 'react';

import { Box, HStack } from '@chakra-ui/react';

import { useRouter } from 'next/router';

import usePrinting from '@/contexts/printing/PrintingContext';

import GlobalLayout from '@/layouts/GlobalLayout';
import Layout from '@/layouts/PrintingLayout';

import PrintInfo from '@/components/printing/prints/PrintInfo';
import PrintList from '@/components/printing/prints/PrintList';

export default function FindPrint(props) {
    const { queue } = usePrinting();
    const router = useRouter();
    const [selectedPrintId, setSelectedPrintId] = useState(null);

    useEffect(() => {
        console.log(router.query);
        if (router.query.slug) {
            setSelectedPrintId(router.query.slug[0]);
        }
    }, [router.query]);

    const selectedPrintData = useMemo(() => {
        if (!selectedPrintId) return null;
        return queue.find((print) => print._id === selectedPrintId);
    }, [selectedPrintId, queue]);

    return (
        <>
            <Box
                w="100%"
                h="100%"
                overflow="hidden"
            >
                <HStack
                    w="100%"
                    h="100%"
                    spacing={0}
                    alignItems="flex-start"
                    justifyContent="flex-start"
                >
                    <PrintList
                        selectedPrintData={selectedPrintData}
                        setSelectedPrintId={setSelectedPrintId}
                    />

                    <HStack
                        w="auto"
                        h="full"
                        flexGrow={1}
                        overflow="auto"
                        justify="center"
                    >
                        <PrintInfo selectedPrintData={selectedPrintData} />
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
