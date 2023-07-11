import { Card, CardBody, Heading, Text, Box, HStack, Badge, Button, VStack, Progress, useColorModeValue, Spacer, Stat, StatLabel, StatNumber, SimpleGrid, Divider, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react"
import { Responsive, WidthProvider } from "react-grid-layout";

import Layout from "@/layouts/PrintingLayout"
import { AiOutlineArrowRight, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { FaHeartBroken, FaWrench } from "react-icons/fa";
import { PiQueueFill } from "react-icons/pi";
import { ArrowForwardIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const layouts = {
    lg: [
        { i: "printer1", x: 0, y: 0, w: 2, h: 2 },
        { i: "printer2", x: 2, y: 0, w: 2, h: 2 },
        { i: "printer3", x: 4, y: 0, w: 2, h: 2 },
        { i: "printer4", x: 0, y: 2, w: 2, h: 2 },
    ]
}

export default function Dashboard(props) {

    const ResponsiveGridLayout = WidthProvider(Responsive);

    return (
        <>
            <Box h="100%" w="100%" overflow="auto">
                <ResponsiveGridLayout
                    className="layout"
                    //draggableHandle=".drag-handle"
                    style={{ width: "100%", height: "100%", overflow: "auto" }}
                    layouts={{ lg: layouts.lg }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    margin={[15, 15]}
                    rowHeight={150}
                    isDraggable 
                    isResizable={false}
                >
                    <Card
                        key="printer1"
                        variant="filled"
                        borderRadius={10}
                    >
                        <CardBody>
                            <VStack spacing={3} alignItems="flex-start" h="100%">

                                {/* header */}
                                <HStack>
                                    <Heading size="md">Left Stratasys</Heading>
                                    <Badge variant="subtle" colorScheme="green">Printing</Badge>
                                </HStack>

                                <HStack w="100%">
                                    <Stat>
                                        <StatNumber fontSize="2xl">3</StatNumber>
                                        <StatLabel>Prints in queue</StatLabel>
                                    </Stat>
                                    <Stat>
                                        <StatNumber fontSize="2xl">3 days</StatNumber>
                                        <StatLabel>Uptime</StatLabel>
                                    </Stat>
                                </HStack>

                                <Spacer />
                                <Divider />

                                {/* active print */}
                                <VStack alignItems="flex-start" w="100%" spacing={4}>

                                    <VStack w="100%" spacing={2} alignItems="flex-start">
                                        <HStack w="100%">
                                            <Tooltip label="PI_Colin_Hartigan_long_print_name" placement="top">
                                                <Text fontSize="lg" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                                    PI_Colin_Hartigan_long_print_name
                                                </Text>
                                            </Tooltip>
                                            <Spacer />
                                            <Text fontSize="xs" whiteSpace="nowrap">
                                                10:30:00
                                            </Text>
                                        </HStack>
                                        <Progress
                                            value={50}
                                            size="sm"
                                            w="100%"
                                            borderRadius={5}
                                        />
                                        <VStack w="100%" alignItems="flex-start" spacing={1}>
                                            <Text fontSize="xs">
                                                Queued by person lastname
                                            </Text>
                                        </VStack>
                                    </VStack>

                                    <ButtonGroup
                                        isAttached
                                        size="md"
                                        variant="outline"
                                        w="100%"
                                    >
                                        <IconButton colorScheme="green" w="100%">
                                            <CheckIcon />
                                        </IconButton>
                                        <IconButton colorScheme="red" w="100%">
                                            <CloseIcon />
                                        </IconButton>
                                    </ButtonGroup>
                                </VStack>

                            </VStack>

                        </CardBody>
                    </Card>

                    <Card
                        key="printer2"
                        variant="filled"
                        borderRadius={10}
                    >
                        <CardBody>
                            <VStack spacing={3} alignItems="flex-start" h="100%">

                                {/* header */}
                                <HStack>
                                    <Heading size="md">Center Stratasys</Heading>
                                    <Badge variant="subtle" colorScheme="yellow">Idle</Badge>
                                </HStack>

                                <HStack w="100%">
                                    <Stat>
                                        <StatNumber fontSize="2xl">3</StatNumber>
                                        <StatLabel>Prints in queue</StatLabel>
                                    </Stat>
                                    <Stat>
                                        <StatNumber fontSize="2xl">3 days</StatNumber>
                                        <StatLabel>Uptime</StatLabel>
                                    </Stat>
                                </HStack>

                                <Spacer />
                                <Divider />

                                {/* last print */}
                                <VStack alignItems="flex-start" w="100%" spacing={4}>

                                    <VStack w="100%" spacing={2} alignItems="flex-start">
                                        <HStack w="100%">
                                            <Tooltip label="PI_Colin_Hartigan_long_print_name" placement="top">
                                                <Text fontSize="lg" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                                    PI_Colin_Hartigan_long_print_name
                                                </Text>
                                            </Tooltip>
                                            <Spacer />
                                            <Text fontSize="xs" whiteSpace="nowrap">
                                                done: 1h 30m
                                            </Text>
                                        </HStack>
                                        <Progress
                                            value={50}
                                            size="sm"
                                            w="100%"
                                            borderRadius={5}
                                            colorScheme="green"
                                        />
                                        <VStack w="100%" alignItems="flex-start" spacing={1}>
                                            <Text fontSize="xs">
                                                Queued by person lastname
                                            </Text>
                                        </VStack>
                                    </VStack>

                                    <Button w="100%" variant="outline" rightIcon={<ArrowForwardIcon />}>
                                        Start print
                                    </Button>
                                </VStack>
                            </VStack>

                        </CardBody>
                    </Card>

                    <Card
                        key="printer3"
                        variant="filled"
                        borderRadius={10}
                    >
                        <CardBody>
                            <VStack spacing={3} alignItems="flex-start" h="100%">

                                {/* header */}
                                <HStack>
                                    <Heading size="md">Center Stratasys</Heading>
                                    <Badge variant="subtle" colorScheme="yellow">Idle</Badge>
                                    <Badge variant="subtle" colorScheme="red">Failed</Badge>
                                </HStack>

                                <HStack w="100%">
                                    <Stat>
                                        <StatNumber fontSize="2xl">3</StatNumber>
                                        <StatLabel>Prints in queue</StatLabel>
                                    </Stat>
                                    <Stat>
                                        <StatNumber fontSize="2xl">3 days</StatNumber>
                                        <StatLabel>Uptime</StatLabel>
                                    </Stat>
                                </HStack>

                                <Spacer />
                                <Divider />

                                {/* last print */}
                                <VStack alignItems="flex-start" w="100%" spacing={4}>

                                    <VStack w="100%" spacing={2} alignItems="flex-start">
                                        <HStack w="100%">
                                            <Tooltip label="PI_Colin_Hartigan_long_print_name" placement="top">
                                                <Text fontSize="lg" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                                    PI_Colin_Hartigan_long_print_name
                                                </Text>
                                            </Tooltip>
                                            <Spacer />
                                            <Text fontSize="xs" whiteSpace="nowrap">
                                                failed
                                            </Text>
                                        </HStack>
                                        <Progress
                                            value={50}
                                            size="sm"
                                            w="100%"
                                            borderRadius={5}
                                            colorScheme="red"
                                        />
                                        <VStack w="100%" alignItems="flex-start" spacing={1}>
                                            <Text fontSize="xs">
                                                Queued by person lastname
                                            </Text>
                                        </VStack>
                                    </VStack>

                                    <ButtonGroup
                                        isAttached
                                        size="md"
                                        variant="outline"
                                        w="100%"
                                    >
                                        <Button w="100%" variant="outline" colorScheme="orange">
                                            Maintenance
                                        </Button>
                                        <Button w="100%" variant="outline" rightIcon={<ArrowForwardIcon />}>
                                            Start print
                                        </Button>
                                    </ButtonGroup>
                                </VStack>
                            </VStack>

                        </CardBody>
                    </Card>

                    <Card
                        key="printer4"
                        variant="filled"
                        borderRadius={10}
                    >
                        <CardBody>
                            <VStack spacing={3} alignItems="flex-start" h="100%">

                                {/* header */}
                                <HStack>
                                    <Heading size="md">Right Stratasys</Heading>
                                    <Badge variant="subtle" colorScheme="red">Down</Badge>
                                </HStack>

                                <HStack w="100%">
                                    <Stat>
                                        <StatNumber fontSize="2xl">3</StatNumber>
                                        <StatLabel>Queue</StatLabel>
                                    </Stat>
                                    <Stat>
                                        <StatNumber fontSize="2xl">1 day</StatNumber>
                                        <StatLabel>Downtime</StatLabel>
                                    </Stat>
                                </HStack>

                                <Box w="100%">
                                    <Text fontSize="md">
                                        a short text block about why the printer is down with updates about maintenance
                                    </Text>
                                </Box>

                                <Spacer />
                                <Button w="100%" variant="outline" colorScheme="orange" rightIcon={<FaWrench />}>
                                    Maintenance
                                </Button>

                            </VStack>

                        </CardBody>
                    </Card>

                </ResponsiveGridLayout>
            </Box>
        </>
    )
}

Dashboard.getLayout = (page) => <Layout>{page}</Layout>