import { useState, useEffect, useMemo } from "react";
import { Card, CardBody, Heading, Text, Box, HStack, Badge, Button, VStack, Progress, useColorModeValue, Spacer, Stat, StatLabel, StatNumber, SimpleGrid, Divider, ButtonGroup, IconButton, Tooltip, Table, Thead, Tr, Th, Tbody, Td, TableContainer, StatHelpText, Flex } from "@chakra-ui/react"
import { Responsive, WidthProvider } from "react-grid-layout";
import { FaWrench } from "react-icons/fa";
import { ArrowForwardIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { HiMiniQueueList } from "react-icons/hi2";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import Layout from "@/layouts/PrintingLayout"
import PrinterCard from "@/components/printing/dashboard/PrinterItem";
import CardTemplate from "@/components/printing/dashboard/CardTemplate";

const defaultLayouts = {
    lg: [
        { i: "recent", x: 0, y: 0, w: 4, h: 4 },
        { i: "stratasyses", x: 4, y: 0, w: 3, h: 3 },
        { i: "stat1", x: 4, y: 3, w: 2, h: 1 }
    ]
}

export default function Dashboard(props) {

    const ResponsiveGridLayout = WidthProvider(Responsive);

    const layouts = useMemo(() => {
        let newLayouts = { lg: [...defaultLayouts.lg] }
        for (let i = 0; i < 10; i++) {
            newLayouts.lg.push({ i: `printer${i}`, x: (i * 2) % 12, y: i % 12, w: 2, h: 2 })
        }
        return newLayouts
    }, [])

    useEffect(() => {

    }, [layouts])

    return (
        <>
            <Box h="100%" w="100%" overflow="auto">
                <ResponsiveGridLayout
                    className="layout"
                    //draggableHandle=".drag-handle"
                    style={{ width: "100%", height: "100%", overflow: "auto", }}
                    layouts={{ lg: layouts.lg }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    margin={[15, 15]}
                    rowHeight={150}
                    isDraggable={true}
                    isResizable={false}
                >

                    {/* {layouts.lg.map((i) => {
                        if(i.i.includes("printer"))
                            return (
                                <div key={i.i}>
                                    <PrinterCard status="printing" />
                                </div>
                            )
                    })} */}

                    <div key="stratasyses">
                        <CardTemplate title="Stratasyses" >
                            <VStack spacing={3} alignItems="flex-start" flexGrow={1} w="100%">
                                <PrinterCard status="printing"/>
                                <PrinterCard status="idle"/>
                                <PrinterCard status="down"/>
                            </VStack>
                        </CardTemplate>
                    </div>

                    <div key="stat1">
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
                    </div>

                    <div key="recent">
                        <CardTemplate title="Recently queued" >
                            <VStack w="100%" spacing={4}>

                                <TableContainer w="100%">
                                    <Table variant="simple">
                                        <Thead>
                                            <Tr>
                                                <Th>
                                                    Date
                                                </Th>
                                                <Th>
                                                    Print name
                                                </Th>
                                                <Th>
                                                    Printer
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            <Tr>
                                                <Td whiteSpace="nowrap" textOverflow="ellipsis" >
                                                    2023-05-10 15:24
                                                </Td>
                                                <Td whiteSpace="nowrap" textOverflow="ellipsis" >
                                                    PI_Colin_Hartigan_long_print_name
                                                </Td>
                                                <Td whiteSpace="nowrap" textOverflow="ellipsis" >
                                                    <Badge variant="subtle" fontSize="sm">
                                                        Ultimaker 3
                                                    </Badge>
                                                </Td>
                                            </Tr>
                                            <Tr>
                                                <Td whiteSpace="nowrap" textOverflow="ellipsis" >
                                                    2023-05-10 15:24
                                                </Td>
                                                <Td whiteSpace="nowrap" textOverflow="ellipsis" >
                                                    PI_Colin_Hartigan_long_print_name
                                                </Td>
                                                <Td whiteSpace="nowrap" textOverflow="ellipsis" >
                                                    <Badge variant="subtle" fontSize="sm">
                                                        Ultimaker 3
                                                    </Badge>
                                                </Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </TableContainer>

                            </VStack>
                        </CardTemplate>
                    </div>

                </ResponsiveGridLayout >
            </Box >
        </>
    )
}

Dashboard.getLayout = (page) => <Layout>{page}</Layout>