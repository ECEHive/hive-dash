import { useContext, useEffect, useMemo, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { FaWrench } from 'react-icons/fa';
import { HiMiniQueueList } from 'react-icons/hi2';
import 'react-resizable/css/styles.css';

import { Box, SimpleGrid } from '@chakra-ui/react';

import { ArrowForwardIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

import PrintingContext from '@/contexts/printing/PrintingContext';

import Layout from '@/layouts/printing/PrintingLayout';

import CardTemplate from '@/components/printing/dashboard/CardTemplate';
import PrinterCard from '@/components/printing/dashboard/PrinterItem';

export default function Dashboard(props) {
    const { printers, queue } = useContext(PrintingContext);

    return (
        <>
            <Box h="100%" w="100%" overflow="auto" p={5}>
                <SimpleGrid spacing={4} columns={3} w="100%" h="100%">
                    {printers.map((printer) => {
                        return <PrinterCard key={printer.id} data={printer} />;
                    })}
                </SimpleGrid>
            </Box>
        </>
    );
}

Dashboard.getLayout = (page) => <Layout>{page}</Layout>;
