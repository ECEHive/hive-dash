import {
    Card,
    CardBody,
    VStack,
    HStack,
    Heading,
    Badge,
    useColorModeValue,
    StatNumber,
    StatLabel,
    Box,
    Spacer,
    Divider,
    Progress,
    Tooltip,
    Text,
    ButtonGroup,
    Button,
    IconButton
} from '@chakra-ui/react';
import { FaWrench } from 'react-icons/fa';
import { ArrowForwardIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

export default function PrinterCard({ status, k }) {

    return (
        <Card
            variant="filled"
            borderRadius={10}
            w="100%"
            // bgColor={useColorModeValue('gray.200', 'gray.600')}
            flexGrow={1}
            // maxH="115px"
            // h="115px"
        >
            <CardBody>
                <VStack spacing={2} alignItems="flex-start" h="100%">
                    <HStack w="100%">
                        <Heading size="md" fontWeight="medium">
                            Center Stratasys
                        </Heading>
                        <Badge variant="subtle" colorScheme="yellow">
                            idle
                        </Badge>
                        <Spacer />
                        <HStack spacing={1}>
                            {/* <HiMiniQueueList /> */}
                            <Text fontSize="md" fontWeight="bold">
                                1
                            </Text>
                            <Text fontSize="sm">in queue</Text>
                        </HStack>
                    </HStack>
                    {/* <Spacer /> */}
                    <VStack
                        justifyContent="center"
                        spacing={1}
                        w="100%"
                        h="100%"
                    >
                        <HStack w="100%" maxW="100%" overflow="hidden">
                            <Tooltip
                                label="PI_Colin_Hartigan_long_print_name"
                                placement="top"
                            >
                                <Text
                                    fontSize="md"
                                    whiteSpace="nowrap"
                                    textOverflow="ellipsis"
                                    overflow="hidden"
                                >
                                    PI_Colin_Hartigan_long_print_name
                                </Text>
                            </Tooltip>
                            <Spacer />
                            <Badge variant="subtle">complete</Badge>
                        </HStack>
                        <Progress
                            value={100}
                            size="sm"
                            w="100%"
                            borderRadius={5}
                            colorScheme="green"
                        />
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
