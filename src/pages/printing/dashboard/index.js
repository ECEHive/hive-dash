import { useMemo } from 'react';

import {
    Box,
    ButtonGroup,
    Flex,
    HStack,
    Heading,
    Icon,
    IconButton,
    SimpleGrid,
    Spacer,
    Table,
    TableContainer,
    Tbody,
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import useLocalStorage from '@/hooks/useLocalStorage';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

import GlobalLayout from '@/layouts/GlobalLayout';
import Layout from '@/layouts/PrintingLayout';

import PrinterCard from '@/components/printing/dashboard/PrinterGridItem';
import PrinterListItem from '@/components/printing/dashboard/PrinterListItem';
import Statistic from '@/components/printing/dashboard/Statistic';

export default function Dashboard(props) {
    const { printers, queue } = usePrinting();
    const [layout, setLayout] = useLocalStorage('dashboardLayout', 'grid');

    const metrics = useMemo(() => {
        return [
            {
                name: 'All-time prints',
                value: queue.length,
                icon: iconSet.boxes
            },
            {
                name: 'Longest queue',
                value: () => {
                    let longest = 0;
                    let longestPrinter = null;

                    printers.forEach((printer) => {
                        let length = queue.filter(
                            (print) =>
                                print.printer === printer.id &&
                                (print.state === PrintStates.FAILED || print.state === PrintStates.QUEUED)
                        ).length;
                        if (length > longest) {
                            longest = length;
                            longestPrinter = printer.displayName;
                        }
                    });

                    return `${longestPrinter} (${longest})`;
                },
                icon: iconSet.queue
            },
            {
                name: 'Average lead time (est.)',
                value: () => {
                    let total = dayjs.duration(0, 'seconds');

                    printers.forEach((printer) => {
                        let printerPrints = queue.filter(
                            (print) =>
                                print.printer === printer.id &&
                                (print.state === PrintStates.FAILED || print.state === PrintStates.QUEUED)
                        );

                        let printerTotal = dayjs.duration(0, 'seconds');

                        printerPrints.forEach((print) => {
                            printerTotal = printerTotal.add(dayjs.duration(print.estTime));
                        });

                        if (printerTotal.asSeconds() > 0) {
                            total = total.add(
                                dayjs.duration(printerTotal.asSeconds() / printerPrints.length, 'seconds')
                            );
                        }
                    });
                    //console.log(total);
                    return dayjs.duration(total.asSeconds() / printers.length, 'seconds').humanize();
                },
                icon: iconSet.clock
            }
        ];
    }, [printers, queue]);

    return (
        <>
            <Box
                overflow="hidden"
                w="full"
                h="full"
            >
                <Flex
                    w="full"
                    h="full"
                    overflow="auto"
                    direction="column"
                    align="center"
                >
                    <VStack
                        spacing={8}
                        h="auto"
                        w="full"
                        align="start"
                        justify="start"
                        maxW="8xl"
                        p={5}
                    >
                        <VStack
                            w="full"
                            h="auto"
                        >
                            <Heading
                                size="lg"
                                mb={3}
                                alignSelf="start"
                            >
                                Statistics
                            </Heading>
                            {/* statistics */}
                            <SimpleGrid
                                spacing={4}
                                columns={3}
                                w="100%"
                                h="auto"
                            >
                                {metrics.map((metric) => {
                                    return (
                                        <Statistic
                                            key={metric.name}
                                            name={metric.name}
                                            icon={metric.icon}
                                            value={typeof metric.value === 'function' ? metric.value() : metric.value}
                                        />
                                    );
                                })}
                            </SimpleGrid>
                        </VStack>

                        {/* printers */}
                        <VStack
                            w="full"
                            h="auto"
                        >
                            <HStack
                                w="full"
                                mb={3}
                            >
                                <Heading size="lg">Printers</Heading>
                                <Spacer />
                                <ButtonGroup
                                    size="sm"
                                    alignSelf="end"
                                    isAttached
                                >
                                    <IconButton
                                        isActive={layout === 'list'}
                                        onClick={() => {
                                            setLayout('list');
                                        }}
                                    >
                                        <Icon as={iconSet.list} />
                                    </IconButton>
                                    <IconButton
                                        isActive={layout === 'grid'}
                                        onClick={() => {
                                            setLayout('grid');
                                        }}
                                    >
                                        <Icon as={iconSet.grid} />
                                    </IconButton>
                                </ButtonGroup>
                            </HStack>

                            {layout === 'grid' ? (
                                <SimpleGrid
                                    spacing={4}
                                    columns={3}
                                    w="100%"
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
                            ) : (
                                <TableContainer w="full">
                                    <Table
                                        size="md"
                                        // variant="striped"
                                    >
                                        <Thead>
                                            <Tr>
                                                <Th>Printer</Th>
                                                <Th>Status</Th>
                                                <Th># Queue</Th>
                                                <Th>Current print</Th>
                                                <Th>Links</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {printers.map((printer) => {
                                                return (
                                                    <PrinterListItem
                                                        key={printer.id}
                                                        data={printer}
                                                    />
                                                );
                                            })}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            )}
                        </VStack>
                    </VStack>
                </Flex>
            </Box>
        </>
    );
}

Dashboard.getLayout = (page) => (
    <GlobalLayout>
        <Layout>{page}</Layout>
    </GlobalLayout>
);
