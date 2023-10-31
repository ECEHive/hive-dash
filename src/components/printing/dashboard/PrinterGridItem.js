import { Badge, Card, CardBody, HStack, Heading, Icon, Link, Progress, Spacer, Text, VStack } from '@chakra-ui/react';

import NextLink from 'next/link';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';
import usePrinterParser from '@/hooks/printing/usePrinterParser';

import iconSet from '@/util/icons';
import { PrintStates, StateColors } from '@/util/states';

export default function PrinterCard({ data }) {
    const { expandedPrinterData, currentPrintData } = usePrinterParser(data);
    const { betterPrintData } = usePrintParser(currentPrintData);
    const { progress, progressBarColor, progressMessage, complete, timeLeftHumanizedDetailed, timeLeftHumanized } =
        usePrintProgress(currentPrintData);

    return (
        <>
            {expandedPrinterData && (
                <Card
                    variant="elevated"
                    dropShadow="sm"
                    borderRadius={10}
                    w="100%"
                    // bgColor={useColorModeValue('gray.200', 'gray.600')}
                    flexGrow={1}
                    h="100%"
                    // h="115px"
                >
                    <CardBody p={5}>
                        <VStack
                            spacing={4}
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
                                        fontWeight="bold"
                                    >
                                        <Link
                                            as={NextLink}
                                            href={`/printing/printers/${data.id}`}
                                        >
                                            {expandedPrinterData.displayName}
                                        </Link>
                                    </Heading>
                                    <Spacer />
                                    <Badge
                                        variant="subtle"
                                        colorScheme={StateColors[expandedPrinterData.state]}
                                    >
                                        {expandedPrinterData.state}
                                    </Badge>
                                </HStack>
                                <HStack
                                    spacing={2}
                                    color="secondaryText"
                                >
                                    <Icon as={iconSet.queue} />
                                    <Text fontWeight="normal">{expandedPrinterData?.queueLength} in queue</Text>
                                </HStack>
                            </VStack>

                            {betterPrintData && (
                                <VStack
                                    justifyContent="center"
                                    align="start"
                                    spacing={1}
                                    w="100%"
                                    h="auto"
                                >
                                    <Progress
                                        value={progress}
                                        size="xs"
                                        w="100%"
                                        colorScheme={progressBarColor}
                                    />

                                    <VStack
                                        align="start"
                                        spacing={0}
                                        justify="start"
                                    >
                                        {/* <Tooltip
                                            label={betterPrintData.trayName}
                                            placement="top"
                                        > */}
                                        <Text
                                            fontSize="md"
                                            whiteSpace="nowrap"
                                            textOverflow="ellipsis"
                                            overflow="hidden"
                                            fontWeight="medium"
                                        >
                                            <Link
                                                as={NextLink}
                                                href={`/printing/prints/${betterPrintData._id}`}
                                            >
                                                {betterPrintData.trayName}
                                            </Link>
                                        </Text>
                                        {betterPrintData.state !== PrintStates.COMPLETED && (
                                            <HStack
                                                fontSize="xs"
                                                color="secondaryText"
                                                spacing={1}
                                            >
                                                <Icon as={iconSet.clock} />
                                                <Text>{timeLeftHumanizedDetailed}</Text>
                                            </HStack>
                                        )}
                                        {/* </Tooltip> */}
                                    </VStack>
                                </VStack>
                            )}
                        </VStack>
                    </CardBody>
                </Card>
            )}
        </>
    );
}
