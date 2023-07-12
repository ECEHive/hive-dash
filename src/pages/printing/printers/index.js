import {
    Box,
    Button,
    Card,
    CardBody,
    VStack,
    HStack,
    Heading,
    Badge,
    Spacer,
    Text,
    CircularProgress,
    CircularProgressLabel,
    Grid,
    GridItem,
    useColorModeValue,
    Progress
} from '@chakra-ui/react';

import TopLayout from '@/layouts/printing/PrintingLayout';

export default function Printers(props) {
    return (
        <>
            <Box w="100%" h="100%" overflow="auto" p={5}>
                <HStack
                    w="100%"
                    h="100%"
                    spacing={4}
                    alignItems="flex-start"
                    justifyContent="flex-start"
                >
                    {/* scrolling list thingy */}
                    <VStack
                        w="400px"
                        h="100%"
                        spacing={2}
                        alignItems="flex-start"
                        justifyContent="flex-start"
                    >
                        <Text fontSize="xl" fontWeight="bold" my={1}>
                            Stratasys
                        </Text>
                        <Card
                            w="100%"
                            h="115px"
                            as={Button}
                            p={0}
                            variant="filled"
                        >
                            <CardBody w="100%">
                                <VStack
                                    spacing={0}
                                    alignItems="flex-start"
                                    h="100%"
                                >
                                    <HStack w="100%">
                                        <Heading size="md" fontWeight="medium">
                                            Center Stratasys
                                        </Heading>
                                        <Badge
                                            variant="subtle"
                                            colorScheme="yellow"
                                        >
                                            idle
                                        </Badge>
                                    </HStack>

                                    <Spacer />

                                    <HStack
                                        w="100%"
                                        justifyContent="flex-start"
                                        spacing={5}
                                    >
                                        {/* <CircularProgress value={100} color="green.200" size={8} /> */}
                                        <VStack
                                            alignItems="flex-start"
                                            spacing={0}
                                        >
                                            <HStack spacing={1}>
                                                <CircularProgress
                                                    value={100}
                                                    color="green.200"
                                                    size={4}
                                                    thickness={10}
                                                />
                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="semibold"
                                                >
                                                    11:59
                                                </Text>
                                            </HStack>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="normal"
                                            >
                                                est. remaining
                                            </Text>
                                        </VStack>
                                        <VStack
                                            alignItems="flex-start"
                                            spacing={0}
                                        >
                                            <Text
                                                fontSize="lg"
                                                fontWeight="semibold"
                                            >
                                                9
                                            </Text>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="normal"
                                            >
                                                in queue
                                            </Text>
                                        </VStack>
                                        {/* <VStack alignItems="flex-start" spacing={0}>
                                            <Text fontSize="lg" fontWeight="semibold">ABS</Text>
                                            <Text fontSize="xs" fontWeight="normal">material</Text>
                                        </VStack> */}
                                    </HStack>
                                </VStack>
                            </CardBody>
                        </Card>
                    </VStack>

                    <Card
                        h="100%"
                        flexGrow={1}
                        variant="filled"
                        borderRadius={10}
                    >
                        <CardBody>
                            <Heading size="lg" mb={4}>
                                Center Stratasys
                            </Heading>
                            <VStack
                                alignItems="flex-start"
                                h="auto"
                                w="100%"
                                spacing={4}
                                overflow="auto"
                            >
                                <Card
                                    w="100%"
                                    h="auto"
                                    variant="filled"
                                    bgColor={useColorModeValue(
                                        'gray.200',
                                        'gray.600'
                                    )}
                                >
                                    <CardBody>
                                        <HStack w="100%">
                                            <VStack w="100%" spacing={1}>
                                                <HStack w="100%">
                                                    <VStack
                                                        alignItems="flex-start"
                                                        h="100%"
                                                        w="100%"
                                                        spacing={0}
                                                    >
                                                        <Text
                                                            fontSize="lg"
                                                            fontWeight="medium"
                                                        >
                                                            PI_Colin_Hartigan_long_print_name
                                                        </Text>
                                                        <Text fontSize="sm">
                                                            Queued by: firstname
                                                            lastname
                                                        </Text>
                                                    </VStack>
                                                    <Spacer />
                                                    <Badge
                                                        variant="subtle"
                                                        alignSelf="flex-end"
                                                    >
                                                        complete
                                                    </Badge>
                                                </HStack>
                                                <Progress
                                                    w="100%"
                                                    value={100}
                                                    size="sm"
                                                    borderRadius={5}
                                                    colorScheme="green"
                                                />
                                            </VStack>
                                        </HStack>
                                    </CardBody>
                                </Card>
                            </VStack>
                        </CardBody>
                    </Card>
                </HStack>
            </Box>
        </>
    );
}

Printers.getLayout = (page) => <TopLayout>{page}</TopLayout>;
