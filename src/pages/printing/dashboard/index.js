import { useContext, useEffect } from 'react';

import { ButtonGroup, Divider, Icon, IconButton, SimpleGrid, VStack } from '@chakra-ui/react';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

import Layout from '@/layouts/printing/PrintingLayout';

import PrinterCard from '@/components/printing/dashboard/PrinterGridItem';
import Statistic from '@/components/printing/dashboard/Statistic';

export default function Dashboard(props) {
    const { printers, queue } = useContext(PrintingContext);

    useEffect(() => {
        console.log(printers);
    }, [printers]);

    const metrics = [
        {
            name: 'All-time prints',
            value: queue.length
        },
        {
            name: 'Longest queue',
            value: () => {
                let longest = 0;
                let longestPrinter = null;

                printers.forEach((printer) => {
                    let length = queue.filter((print) => print.printer === printer.id).length;
                    if (length > longest) {
                        longest = length;
                        longestPrinter = printer.displayName;
                    }
                });

                return `${longestPrinter} (${longest})`;
            }
        },
        {
            name: 'Average lead time',
            value: () => {
                let total = dayjs.duration(0, 'seconds');

                printers.forEach((printer) => {
                    let printerPrints = queue.filter((print) => print.printer === printer.id);

                    let printerTotal = dayjs.duration(0, 'seconds');

                    printerPrints.forEach((print) => {
                        if (print.state === PrintStates.QUEUED || print.state === PrintStates.FAILED) {
                            printerTotal = printerTotal.add(dayjs.duration(print.estTime));
                        }
                    });
                    console.log(printerTotal);
                    //console.log(dayjs.duration(printerTotal, 'seconds').humanize());
                    total = total.add(
                        dayjs.duration(
                            printerTotal.asSeconds() / queue.filter((print) => print.printer === printer.id).length,
                            'seconds'
                        )
                    );
                });

                return total.humanize();
            }
        }
    ];

    return (
        <>
            <VStack
                h="100%"
                w="100%"
                overflow="auto"
                p={5}
                spacing={4}
            >
                {/* statistics */}
                <SimpleGrid
                    spacing={4}
                    columns={3}
                    w="100%"
                    maxW="6xl"
                    h="auto"
                >
                    {metrics.map((metric) => {
                        return (
                            <Statistic
                                key={metric.name}
                                name={metric.name}
                                value={typeof metric.value === 'function' ? metric.value() : metric.value}
                            />
                        );
                    })}
                </SimpleGrid>

                <Divider w="70%" />

                {/* printers */}
                <VStack>
                    <ButtonGroup
                        size="sm"
                        alignSelf="end"
                        isAttached
                    >
                        <IconButton>
                            <Icon as={iconSet.list} />
                        </IconButton>
                        <IconButton>
                            <Icon as={iconSet.grid} />
                        </IconButton>
                    </ButtonGroup>
                    <SimpleGrid
                        spacing={4}
                        columns={3}
                        w="100%"
                        maxW="6xl"
                        h="auto"
                    >
                        {printers.map((printer) => {
                            return (
                                <PrinterCard
                                    key={printer.id}
                                    data={printer}
                                />
                            );
                        })}
                    </SimpleGrid>
                </VStack>
            </VStack>
        </>
    );
}

Dashboard.getLayout = (page) => <Layout>{page}</Layout>;
