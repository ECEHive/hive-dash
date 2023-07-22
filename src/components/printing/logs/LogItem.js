import { Badge, Td, Tr } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import usePrintParser from '@/hooks/usePrintParser';

import getStateColor from '@/util/getStateColor';

export default function LogItem({ printData }) {
    const { expandedPrintData, progressMessage, progressColor, printerData } =
        usePrintParser(printData);

    return (
        <Tr>
            <Td>{expandedPrintData.queuedAtExtendedFormatted}</Td>
            <Td>
                <Badge variant="subtle" colorScheme={progressColor}>
                    {progressMessage}
                </Badge>
            </Td>
            <Td>{expandedPrintData.trayName}</Td>
            <Td>{printerData.displayName}</Td>
            <Td>{expandedPrintData.estTimeFormatted}</Td>
        </Tr>
    );
}
