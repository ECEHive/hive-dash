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
    ButtonGroup,
    IconButton,
    useColorModeValue,
    Progress,
    Flex,
    Tooltip,
    Input,
    InputGroup,
    InputLeftElement,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { FaPlay, FaWrench, FaPencilAlt } from 'react-icons/fa';

import InfoCard from '@/components/printing/printers/InfoCard';
import TopLayout from '@/layouts/printing/PrintingLayout';
import PrintPreview from '@/components/printing/PrintPreview';

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
                        spacing={3}
                        alignItems="flex-start"
                        justifyContent="flex-start"
                    >
                        <InputGroup>
                            <InputLeftElement>
                                <SearchIcon />
                            </InputLeftElement>
                            <Input placeholder="Search for a printer" />
                        </InputGroup>

                        <VStack
                            w="100%"
                            alignItems="flex-start"
                            spacing={3}
                            overflow="auto"
                        >
                            <Text fontSize="xl" fontWeight="bold" my={1}>
                                Stratasys
                            </Text>
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
                                            <Heading
                                                size="md"
                                                fontWeight="medium"
                                            >
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
                                                spacing={0.5}
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
                                                spacing={0.5}
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
                                            <Heading
                                                size="md"
                                                fontWeight="medium"
                                            >
                                                Left Stratasys
                                            </Heading>
                                            <Badge
                                                variant="subtle"
                                                colorScheme="green"
                                            >
                                                printing
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
                                                    <CircularProgress
                                                        value={50}
                                                        color="green.200"
                                                        size={4}
                                                        thickness={10}
                                                    />
                                                    <Text
                                                        fontSize="lg"
                                                        fontWeight="semibold"
                                                    >
                                                        2:59
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
                                                spacing={0.5}
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
                    </VStack>

                    <Card
                        h="100%"
                        flexGrow={1}
                        variant="filled"
                        borderRadius={10}
                    >
                        <CardBody>
                            <HStack w="100%" mb={4} alignItems="center">
                                <Heading size="lg">Center Stratasys</Heading>
                                <Spacer />
                                <IconButton
                                    icon={<FaWrench />}
                                    colorScheme="orange"
                                    isDisabled
                                />
                            </HStack>
                            <VStack
                                alignItems="flex-start"
                                h="auto"
                                w="100%"
                                spacing={4}
                                overflow="auto"
                            >
                                {/* current print */}
                                <PrintPreview
                                    actions={
                                        <ButtonGroup
                                            isAttached
                                            variant="outline"
                                            size="md"
                                        >
                                            <Button
                                                colorScheme="red"
                                                leftIcon={<CloseIcon />}
                                            >
                                                Failed
                                            </Button>
                                            <Button
                                                colorScheme="green"
                                                leftIcon={<CheckIcon />}
                                            >
                                                Completed
                                            </Button>
                                        </ButtonGroup>
                                    }
                                />

                                {/* queue */}
                                <Box w="100%" h="auto">
                                    <TableContainer maxW="100%">
                                        <Table variant="simple" size="sm">
                                            <Thead>
                                                <Tr>
                                                    <Th>Queue date</Th>
                                                    <Th>Status</Th>
                                                    <Th>Print name</Th>
                                                    <Th>Est. time</Th>
                                                    <Th>Actions</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                <Tr>
                                                    <Tooltip
                                                        label="2021-09-01 4:10 PM"
                                                        placement="bottom-start"
                                                    >
                                                        <Td>9/1/2021</Td>
                                                    </Tooltip>
                                                    <Td>
                                                        <Badge
                                                            variant="subtle"
                                                            colorScheme="red"
                                                        >
                                                            failed
                                                        </Badge>
                                                    </Td>
                                                    <Td
                                                        overflow="hidden"
                                                        whiteSpace="nowarp"
                                                        textOverflow="ellipsis"
                                                    >
                                                        PI_Colin_Hartigan_long_print_name
                                                    </Td>
                                                    <Td>11:59</Td>
                                                    <Td>
                                                        <ButtonGroup
                                                            size="sm"
                                                            isAttached
                                                        >
                                                            <IconButton
                                                                icon={
                                                                    <FaPlay />
                                                                }
                                                                colorScheme="green"
                                                                variant="outline"
                                                            />
                                                            <IconButton
                                                                icon={
                                                                    <FaPencilAlt />
                                                                }
                                                                colorScheme="orange"
                                                                variant="outline"
                                                            />
                                                        </ButtonGroup>
                                                    </Td>
                                                </Tr>
                                                <Tr>
                                                    <Td>9/1/2021</Td>
                                                    <Td>
                                                        <Badge variant="subtle">
                                                            queued
                                                        </Badge>
                                                    </Td>
                                                    <Td
                                                        overflow="hidden"
                                                        whiteSpace="nowarp"
                                                        textOverflow="ellipsis"
                                                    >
                                                        PI_Colin_Hartigan_long_print_name
                                                    </Td>
                                                    <Td>11:59</Td>
                                                    <Td>
                                                        <ButtonGroup
                                                            size="sm"
                                                            isAttached
                                                        >
                                                            <IconButton
                                                                icon={
                                                                    <FaPlay />
                                                                }
                                                                colorScheme="green"
                                                                variant="outline"
                                                            />
                                                            <IconButton
                                                                icon={
                                                                    <FaPencilAlt />
                                                                }
                                                                colorScheme="orange"
                                                                variant="outline"
                                                            />
                                                        </ButtonGroup>
                                                    </Td>
                                                </Tr>
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </VStack>
                        </CardBody>
                    </Card>
                </HStack>
            </Box>
        </>
    );
}

Printers.getLayout = (page) => <TopLayout>{page}</TopLayout>;
