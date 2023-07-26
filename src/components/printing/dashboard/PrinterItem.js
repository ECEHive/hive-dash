import {
    Badge,
    Card,
    CardBody,
    HStack,
    Heading,
    Icon,
    Link,
    Progress,
    Spacer,
    Text,
    Tooltip,
    VStack
} from '@chakra-ui/react';

import NextLink from 'next/link';

import usePrintParser from '@/hooks/usePrintParser';
import usePrintProgress from '@/hooks/usePrintProgress';
import usePrinterParser from '@/hooks/usePrinterParser';
import useTextColor from '@/hooks/useTextColor';

import iconSet from '@/util/icons';
import stateColors from '@/util/stateColors';

export default function PrinterCard({ data }) {
    const { expandedPrinterData, currentPrintData } = usePrinterParser(data);
    const { betterPrintData } = usePrintParser(currentPrintData);
    const { progress, progressColor, progressMessage } = usePrintProgress(currentPrintData);

    const { secondary } = useTextColor();

    return (
        <>
            {expandedPrinterData && (
                <Card
                    variant="outline"
                    borderRadius={10}
                    w="100%"
                    // bgColor={useColorModeValue('gray.200', 'gray.600')}
                    flexGrow={1}
                    h="100%"
                    // h="115px"
                >
                    <CardBody>
                        <VStack
                            spacing={2}
                            alignItems="flex-start"
                            h="100%"
                        >
                            <VStack
                                spacing={0.25}
                                align="start"
                                w="full"
                            >
                                <HStack w="100%">
                                    <Heading
                                        size="md"
                                        fontWeight="medium"
                                    >
                                        <Link
                                            as={NextLink}
                                            href={`/printing/printers/${data.id}`}
                                        >
                                            {expandedPrinterData.displayName}
                                        </Link>
                                    </Heading>
                                    {/* <Spacer /> */}
                                    <Badge
                                        variant="subtle"
                                        colorScheme={stateColors[expandedPrinterData.state]}
                                    >
                                        {expandedPrinterData.state}
                                    </Badge>
                                </HStack>
                                <HStack
                                    spacing={2}
                                    color={secondary}
                                >
                                    <Icon as={iconSet.queue} />
                                    <Text fontWeight="normal">{expandedPrinterData?.queueLength} in queue</Text>
                                </HStack>
                            </VStack>
                            <Spacer />
                            {betterPrintData && (
                                <VStack
                                    justifyContent="center"
                                    spacing={1}
                                    w="100%"
                                    h="auto"
                                >
                                    <HStack
                                        w="100%"
                                        maxW="100%"
                                        overflow="hidden"
                                    >
                                        <Tooltip
                                            label={betterPrintData.trayName}
                                            placement="top"
                                        >
                                            <Text
                                                fontSize="md"
                                                whiteSpace="nowrap"
                                                textOverflow="ellipsis"
                                                overflow="hidden"
                                            >
                                                <Link
                                                    as={NextLink}
                                                    href={`/printing/find/${betterPrintData._id}`}
                                                >
                                                    {betterPrintData.trayName}
                                                </Link>
                                            </Text>
                                        </Tooltip>
                                        <Spacer />
                                        <Badge variant="subtle">{progressMessage}</Badge>
                                    </HStack>
                                    <Progress
                                        value={progress}
                                        size="sm"
                                        w="100%"
                                        borderRadius={5}
                                        colorScheme={progressColor}
                                    />
                                </VStack>
                            )}
                        </VStack>
                    </CardBody>
                </Card>
            )}
        </>
    );
}
