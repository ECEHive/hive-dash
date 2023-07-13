import { useState, useEffect, useMemo } from 'react';
import {
    Card,
    CardBody,
    Heading,
    Text,
    Box,
    HStack,
    Badge,
    Button,
    VStack,
    Progress,
    useColorModeValue,
    Spacer,
    Stat,
    StatLabel,
    StatNumber,
    SimpleGrid,
    Divider,
    ButtonGroup,
    IconButton,
    Tooltip,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    TableContainer,
    StatHelpText,
    Flex,
    Grid,
    GridItem
} from '@chakra-ui/react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { FaWrench } from 'react-icons/fa';
import { ArrowForwardIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { HiMiniQueueList } from 'react-icons/hi2';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import Layout from '@/layouts/printing/PrintingLayout';
import PrinterCard from '@/components/printing/dashboard/PrinterItem';
import CardTemplate from '@/components/printing/dashboard/CardTemplate';
import { jsx } from '@emotion/react';

const defaultLayouts = {
    lg: [
        { i: 'printers', x: 0, y: 0, w: 12, h: 7 },
        { i: 'recent', x: 0, y: 0, w: 4, h: 7 }
    ]
};

export default function Dashboard(props) {
    const ResponsiveReactGridLayout = useMemo(
        () => WidthProvider(Responsive),
        []
    );

    const layouts = useMemo(() => {
        let newLayouts = { lg: [...defaultLayouts.lg] };
        for (let i = 0; i < 10; i++) {
            newLayouts.lg.push({
                i: `printer${i}`,
                x: (i * 2) % 12,
                y: i % 12,
                w: 2,
                h: 2
            });
        }
        return newLayouts;
    }, []);

    useEffect(() => {}, [layouts]);

    return (
        <>
            <Box h="100%" w="100%" overflow="auto" p={5}>
                {/* <ResponsiveReactGridLayout
                    className="layout"
                    //draggableHandle=".drag-handle"
                    style={{ width: "100%", height: "100%", overflow: "auto", }}
                    layouts={{ lg: layouts.lg }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    margin={[20, 20]}
                    rowHeight={50}
                    isDraggable={false}
                    isResizable={false}
                > */}

                <Grid
                    h="100%"
                    w="100%"
                    templateColumns={{
                        base: 'repeat(12, 1fr)'
                    }}
                    templateRows={{
                        base: 'repeat(6, 1fr)',
                        '3xl': 'repeat(8, 1fr)'
                    }}
                    gap={4}
                >
                    <GridItem
                        rowSpan={{
                            base: '4',
                            '3xl': '4'
                        }}
                        colSpan={12}
                    >
                        <CardTemplate title="Printer Statuses">
                            <SimpleGrid
                                spacing={4}
                                columns={3}
                                w="100%"
                                h="100%"
                            >
                                <PrinterCard status="printing" />
                                <PrinterCard status="idle" />
                                <PrinterCard status="down" />
                                <PrinterCard status="printing" />
                                <PrinterCard status="idle" />
                                <PrinterCard status="down" />
                                <PrinterCard status="printing" />
                                <PrinterCard status="idle" />
                                <PrinterCard status="down" />
                            </SimpleGrid>
                        </CardTemplate>
                    </GridItem>

                    {/* <div key="stat1">
                        <CardTemplate>
                            <Box w="100%" h="100%">
                                <Stat>
                                    <StatLabel fontSize="xl">Longest queue</StatLabel>
                                    <StatNumber fontSize="3xl" fontFamily="heading">Ultimaker 2</StatNumber>
                                    <Spacer />
                                    <StatHelpText fontSize="md" m="auto">3 prints in queue</StatHelpText>
                                </Stat>
                            </Box>
                        </CardTemplate>
                    </div> */}

                    <GridItem
                        rowSpan={{
                            base: '2',
                            '3xl': '6'
                        }}
                        colSpan={{
                            base: '5',
                            '3xl': '3'
                        }}
                    >
                        <CardTemplate title="Recently queued">
                            <VStack w="100%" spacing={4} overflow="auto">
                                <TableContainer w="100%">
                                    <Table variant="simple" maxW="100%">
                                        <Thead>
                                            <Tr>
                                                <Th>Print name</Th>
                                                <Th>Printer</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            <Tr>
                                                <Td
                                                    whiteSpace="nowrap"
                                                    textOverflow="ellipsis"
                                                >
                                                    PI_Colin_Hartigan_long_print_name
                                                </Td>
                                                <Td
                                                    whiteSpace="nowrap"
                                                    textOverflow="ellipsis"
                                                >
                                                    <Badge
                                                        variant="subtle"
                                                        fontSize="sm"
                                                    >
                                                        Ultimaker 3
                                                    </Badge>
                                                </Td>
                                            </Tr>
                                            <Tr>
                                                <Td
                                                    whiteSpace="nowrap"
                                                    textOverflow="ellipsis"
                                                >
                                                    PI_Colin_Hartigan_long_print_name
                                                </Td>
                                                <Td
                                                    whiteSpace="nowrap"
                                                    textOverflow="ellipsis"
                                                >
                                                    <Badge
                                                        variant="subtle"
                                                        fontSize="sm"
                                                    >
                                                        Ultimaker 3
                                                    </Badge>
                                                </Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </VStack>
                        </CardTemplate>
                    </GridItem>
                </Grid>
                {/* </ResponsiveReactGridLayout > */}
            </Box>
        </>
    );
}

Dashboard.getLayout = (page) => <Layout>{page}</Layout>;
