import {
    Badge,
    Card,
    CardBody,
    CircularProgress,
    CircularProgressLabel,
    HStack,
    Heading,
    Link,
    Progress,
    Spacer,
    Text,
    Tooltip,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import NextLink from 'next/link';

import usePrintParser from '@/hooks/usePrintParser';
import usePrinterParser from '@/hooks/usePrinterParser';

import getStateColor from '@/util/getStateColor';

export default function PrinterCard({ data }) {
    const { expandedPrinterData, currentPrintData } = usePrinterParser(data);
    const {
        expandedPrintData,
        progress,
        timeLeft,
        progressColor,
        progressMessage,
        fixedProgress
    } = usePrintParser(currentPrintData);

    const adjustedProgressColor = useColorModeValue(
        `${progressColor}.600`,
        `${progressColor}.200`
    );

    return (
        <>
            {expandedPrinterData && (
                <Card
                    variant="filled"
                    borderRadius={10}
                    w="100%"
                    // bgColor={useColorModeValue('gray.200', 'gray.600')}
                    flexGrow={1}
                    h="auto"
                    // h="115px"
                >
                    <CardBody>
                        <VStack spacing={2} alignItems="flex-start" h="100%">
                            <VStack spacing={0.25} align="start">
                                <HStack w="100%">
                                    <Heading size="md" fontWeight="medium">
                                        <Link
                                            as={NextLink}
                                            href={`/printing/printers/${data.id}`}
                                        >
                                            {expandedPrinterData.displayName}
                                        </Link>
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
                            {expandedPrintData && (
                                <HStack
                                    w="100%"
                                    align="center"
                                    justify="flex-start"
                                    overflow="hidden"
                                >
                                    <CircularProgress
                                        value={fixedProgress}
                                        size="60px"
                                        thickness="8px"
                                        color={adjustedProgressColor}
                                    >
                                        {/* <CircularProgressLabel>
                                            {fixedProgress}%
                                        </CircularProgressLabel> */}
                                    </CircularProgress>
                                    <VStack
                                        w="auto"
                                        h="80%"
                                        overflow="hidden"
                                        justify="center"
                                        align="start"
                                        spacing={1}
                                    >
                                        <Text
                                            fontSize="lg"
                                            fontWeight="semibold"
                                            textOverflow="ellipsis"
                                            whiteSpace="nowrap"
                                            overflow="hidden"
                                            lineHeight={1}
                                        >
                                            {expandedPrintData.trayName}
                                        </Text>
                                        <Badge variant="subtle">
                                            {progressMessage}
                                        </Badge>
                                        {/* <Text fontSize="sm">
                                            {progressMessage}
                                        </Text> */}
                                    </VStack>
                                </HStack>
                            )}
                        </VStack>
                    </CardBody>
                </Card>
            )}
        </>
    );
}
