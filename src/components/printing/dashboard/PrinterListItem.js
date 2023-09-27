import { Badge, Button, ButtonGroup, CircularProgress, HStack, Icon, Td, Text, Tr, VStack } from '@chakra-ui/react';

import { push } from 'next/router';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';
import usePrinterParser from '@/hooks/printing/usePrinterParser';

import iconSet from '@/util/icons';
import { PrintStates, StateColors } from '@/util/states';

export default function PrinterListItem({ data }) {
    const { expandedPrinterData, currentPrintData, printerTypeData } = usePrinterParser(data);
    const { betterPrintData } = usePrintParser(currentPrintData);
    const { progress, progressBarColor, progressMessage, timeLeftHumanizedDetailed, progressCircleColor } =
        usePrintProgress(currentPrintData);

    return (
        <>
            <Tr>
                <Td>
                    <VStack
                        align="start"
                        spacing={1}
                    >
                        <Text
                            fontSize="lg"
                            fontWeight="medium"
                        >
                            {expandedPrinterData.displayName}
                        </Text>
                        <HStack
                            color="secondaryText"
                            fontSize="sm"
                            spacing={1}
                        >
                            <Icon as={iconSet.refresh} />
                            <Text>{expandedPrinterData.updatedAtHumanized}</Text>
                        </HStack>
                    </VStack>
                </Td>
                <Td>
                    <Badge colorScheme={StateColors[expandedPrinterData.state]}>{expandedPrinterData.state}</Badge>
                </Td>
                <Td>
                    <Text>{expandedPrinterData.queueLength}</Text>
                </Td>

                <Td>
                    {betterPrintData && (
                        <HStack spacing={1.5}>
                            <CircularProgress
                                value={progress}
                                color={progressCircleColor}
                                size={8}
                                thickness={8}
                                trackColor="progressTrackAlt"
                            />
                            <VStack
                                align="start"
                                justify="start"
                                spacing={1}
                            >
                                <Text
                                    fontSize="md"
                                    fontWeight="medium"
                                    lineHeight={1}
                                >
                                    {betterPrintData.trayName}
                                </Text>
                                <Text
                                    fontSize="xs"
                                    fontWeight="normal"
                                    color="secondaryText"
                                    lineHeight={1}
                                >
                                    {timeLeftHumanizedDetailed}
                                </Text>
                            </VStack>
                        </HStack>
                    )}
                    {/* ) : (
                    <Text>N/A</Text>
                )} */}
                </Td>
                <Td>
                    <ButtonGroup
                        size="sm"
                        display="flex"
                        flexDir="row"
                        w="full"
                        alignItems="flex-end"
                    >
                        <Button
                            colorScheme="blue"
                            onClick={() => {
                                push(`/printing/printers/${expandedPrinterData.id}`);
                            }}
                        >
                            View printer
                        </Button>
                        <Button
                            visibility={betterPrintData?.state === PrintStates.PRINTING ? 'visibile' : 'hidden'}
                            onClick={() => {
                                push(`/printing/prints/${betterPrintData._id}`);
                            }}
                        >
                            View print
                        </Button>
                    </ButtonGroup>
                </Td>
            </Tr>
        </>
    );
}
