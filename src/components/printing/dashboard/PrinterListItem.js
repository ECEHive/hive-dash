import {
    Badge,
    Button,
    ButtonGroup,
    CircularProgress,
    HStack,
    Td,
    Text,
    Tr,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import { push } from 'next/router';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';
import usePrinterParser from '@/hooks/printing/usePrinterParser';

import { PrintStates, StateColors } from '@/util/states';

export default function PrinterListItem({ data }) {
    const { expandedPrinterData, currentPrintData, printerTypeData } = usePrinterParser(data);
    const { betterPrintData } = usePrintParser(currentPrintData);
    const { progress, progressBarColor, progressMessage, timeLeftHumanized } = usePrintProgress(currentPrintData);

    const progressTrackColor = useColorModeValue('gray.200', 'gray.500');

    return (
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
                    <Text
                        color="secondaryText"
                        fontSize="sm"
                    >
                        {printerTypeData.displayName}
                    </Text>
                </VStack>
            </Td>
            <Td>
                <Badge colorScheme={StateColors[expandedPrinterData.state]}>{expandedPrinterData.state}</Badge>
            </Td>
            <Td>
                <Text>{expandedPrinterData.queueLength}</Text>
            </Td>
            <Td>
                {/* {betterPrintData.state === PrintStates.PRINTING ? ( */}
                <HStack spacing={1.5}>
                    <CircularProgress
                        value={progress}
                        color={useColorModeValue(`${progressBarColor}.500`, `${progressBarColor}.200`)}
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
                            {timeLeftHumanized}
                        </Text>
                    </VStack>
                </HStack>
                {/* ) : (
                    <Text>N/A</Text>
                )} */}
            </Td>
            <Td>
                <Text>{expandedPrinterData.updatedAtHumanized}</Text>
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
                        visibility={betterPrintData.state === PrintStates.PRINTING ? 'visibile' : 'hidden'}
                        onClick={() => {
                            push(`/printing/find/${betterPrintData._id}`);
                        }}
                    >
                        View print
                    </Button>
                </ButtonGroup>
            </Td>
        </Tr>
    );
}
