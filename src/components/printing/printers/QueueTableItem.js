import { FaPencilAlt, FaPlay } from 'react-icons/fa';

import {
    Badge,
    ButtonGroup,
    IconButton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr
} from '@chakra-ui/react';

import usePrintParser from '@/hooks/usePrintParser';

export default function QueueTableItem({ printData, startPrint, canQueue }) {
    const { expandedPrintData, progressMessage, progressColor } =
        usePrintParser(printData);

    return (
        <Tr key={print._id}>
            <Tooltip
                label={expandedPrintData.queuedAtExtendedFormatted}
                placement="bottom-start"
            >
                <Td>{expandedPrintData.queuedAtFormatted}</Td>
            </Tooltip>
            <Td>
                <Badge variant="subtle" colorScheme={progressColor}>
                    {progressMessage}
                </Badge>
            </Td>
            <Td overflow="hidden" whiteSpace="nowarp" textOverflow="ellipsis">
                {expandedPrintData.trayName}
            </Td>
            <Td>{expandedPrintData.estTimeFormatted}</Td>
            <Td>
                <ButtonGroup size="sm" isAttached>
                    <IconButton
                        icon={<FaPlay />}
                        colorScheme="green"
                        variant="outline"
                        isDisabled={!canQueue}
                        onClick={() => startPrint(printData)}
                    />
                    <IconButton
                        icon={<FaPencilAlt />}
                        colorScheme="orange"
                        variant="outline"
                    />
                </ButtonGroup>
            </Td>
        </Tr>
    );
}
