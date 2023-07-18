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

import getStateColor from '@/util/getStateColor';
import usePrinterParser from '@/hooks/usePrinterParser';
import usePrintParser from '@/hooks/usePrintParser';

export default function PrinterCard({ data }) {
    const { expandedPrinterData, currentPrintData } = usePrinterParser(data);
    const { expandedPrintData, progress, timeLeft, progressColor, progressMessage, fixedProgress } = usePrintParser(currentPrintData);

    return (
        <Card
            variant="filled"
            borderRadius={10}
            w="100%"
            // bgColor={useColorModeValue('gray.200', 'gray.600')}
            flexGrow={1}
            maxH="200px"
            // h="115px"
        >
            <CardBody>
                <VStack spacing={2} alignItems="flex-start" h="100%">
                    <VStack spacing={0.25} align="start">
                        <HStack w="100%">
                            <Heading size="md" fontWeight="medium">
                                {expandedPrinterData.displayName}
                            </Heading>
                            <Badge
                                variant="subtle"
                                colorScheme={getStateColor(
                                    expandedPrinterData.state
                                )}
                            >
                                {expandedPrinterData.state}
                            </Badge>
                        </HStack>
                        <HStack spacing={1}>
                            {/* <HiMiniQueueList /> */}
                            <Text fontSize="md" fontWeight="semibold">
                                {expandedPrinterData.queueLength}
                            </Text>
                            <Text fontSize="sm">in queue</Text>
                        </HStack>
                    </VStack>
                    <Spacer />
                    <VStack
                        justifyContent="center"
                        spacing={1}
                        w="100%"
                        h="auto"
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
                                    {expandedPrintData.trayName}
                                </Text>
                            </Tooltip>
                            <Spacer />
                            <Badge variant="subtle">{progressMessage}</Badge>
                        </HStack>
                        <Progress
                            value={fixedProgress}
                            size="sm"
                            w="100%"
                            borderRadius={5}
                            colorScheme={progressColor}
                        />
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
