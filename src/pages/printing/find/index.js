import {
    Box,
    HStack,
    InputRightAddon,
    VStack,
    InputGroup,
    InputLeftElement,
    Input,
    Text,
    Card,
    CardBody,
    Heading,
    Badge,
    Spacer,
    Button,
    CircularProgress,
    Tooltip,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useColorModeValue
} from '@chakra-ui/react';
import { InfoIcon, SearchIcon } from '@chakra-ui/icons';

import Layout from '@/layouts/printing/PrintingLayout';
import PrintPreview from '@/components/printing/PrintPreview';
import TimelineEvent from '@/components/printing/find/TimelineEvent';

export default function FindPrint(props) {
    return (
        <Box w="100%" h="100%" p={5} overflow="auto">
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
                    spacing={3}
                    alignItems="flex-start"
                    justifyContent="flex-start"
                >
                    <InputGroup>
                        <InputLeftElement>
                            <SearchIcon />
                        </InputLeftElement>
                        <Input placeholder="GT email" />
                        <InputRightAddon>@gatech.edu</InputRightAddon>
                    </InputGroup>

                    <VStack
                        w="100%"
                        alignItems="flex-start"
                        spacing={3}
                        overflow="auto"
                    >
                        <Card
                            w="100%"
                            minH="115px"
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
                                        <Tooltip
                                            label="PI_Colin_Hartigan_long_print_name"
                                            placement="top"
                                        >
                                            <Heading
                                                size="md"
                                                fontWeight="medium"
                                                fontFamily="body"
                                                overflow="hidden"
                                                whiteSpace="nowrap"
                                                textOverflow="ellipsis"
                                            >
                                                PI_Colin_Hartigan_long_print_name
                                            </Heading>
                                        </Tooltip>
                                        <Badge
                                            variant="subtle"
                                            colorScheme="gray"
                                        >
                                            QUEUED
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
                                            spacing={0.5}
                                        >
                                            <HStack spacing={1}>
                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="semibold"
                                                >
                                                    10/23/2023
                                                </Text>
                                            </HStack>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="normal"
                                            >
                                                queue date
                                            </Text>
                                        </VStack>
                                        {/* <VStack
                                            alignItems="flex-start"
                                            spacing={0.5}
                                        >
                                            <HStack spacing={1}>
                                                <Text
                                                    fontSize="lg"
                                                    fontWeight="semibold"
                                                >
                                                    10/24/2023
                                                </Text>
                                            </HStack>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="normal"
                                            >
                                                est. completion
                                            </Text>
                                        </VStack> */}
                                    </HStack>
                                </VStack>
                            </CardBody>
                        </Card>
                    </VStack>
                </VStack>

                <Card
                    h="100%"
                    flexGrow={1}
                    variant="filled"
                    borderRadius={10}
                    overflow="hidden"
                >
                    <CardBody w="100%" h="100%">
                        <VStack
                            w="100%"
                            h="100%"
                            justify="start"
                            align="start"
                            spacing={3}
                            overflow="auto"
                        >
                            <Alert status="warning" borderRadius={5} h="auto">
                                <AlertIcon />
                                <AlertDescription>
                                    This print uses QSR supports, which we
                                    dissolve for you. Expect it to be ready a
                                    day later than the print completion date.
                                </AlertDescription>
                            </Alert>

                            <PrintPreview />

                            {/* timeline */}
                            {/* <Card
                                w="auto"
                                h="auto"
                                variant="filled"
                                bgColor={useColorModeValue(
                                    'gray.200',
                                    'gray.600'
                                )}
                            >
                                <CardBody w="100%" h="100%"> */}
                            <VStack w="100%" h="auto" spacing={0}>
                                <TimelineEvent
                                    topEnd
                                    message="Print complete"
                                />
                                <TimelineEvent message="Print started" />
                                <TimelineEvent
                                    bottomEnd
                                    message="Print queued"
                                />
                            </VStack>
                            {/* </CardBody>
                            </Card> */}
                        </VStack>
                    </CardBody>
                </Card>
            </HStack>
        </Box>
    );
}

FindPrint.getLayout = (page) => <Layout>{page}</Layout>;
