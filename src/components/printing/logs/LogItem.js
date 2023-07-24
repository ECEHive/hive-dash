import { Badge, HStack, Td, Text, Tr, VStack } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import usePrintParser from '@/hooks/usePrintParser';

import getStateColor from '@/util/getStateColor';

export default function LogItem({ printData }) {
    const { expandedPrintData, progressMessage, progressColor, printerData } = usePrintParser(printData);

    return (
        <Tr>
            <Td>
                <VStack
                    align="start"
                    justify="start"
                    spacing={1}
                >
                    <Text fontSize="md">{expandedPrintData.trayName}</Text>
                    <Text
                        fontSize="xs"
                        color="gray.500"
                    >
                        {expandedPrintData.queuedAtExtendedFormatted}
                    </Text>
                </VStack>
            </Td>
            <Td>{printerData.displayName}</Td>
            <Td>
                <Badge
                    variant="subtle"
                    colorScheme={progressColor}
                >
                    {progressMessage}
                </Badge>
            </Td>
            <Td>{expandedPrintData.estTimeFormatted}</Td>
            <Td>{expandedPrintData.queuedBy}</Td>
        </Tr>
    );
}
