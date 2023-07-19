import {
    Badge,
    Card,
    CardBody,
    HStack,
    Heading,
    Link,
    Progress,
    Spacer,
    Text,
    Tooltip,
    VStack
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
                    <VStack
                        justifyContent="center"
                        spacing={1}
                        w="100%"
                        h="auto"
                    >
                        <HStack w="100%" maxW="100%" overflow="hidden">
                            <Tooltip
                                label={expandedPrintData.trayName}
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
