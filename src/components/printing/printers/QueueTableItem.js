import {
    Badge,
    Button,
    ButtonGroup,
    HStack,
    Icon,
    IconButton,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    VStack
} from '@chakra-ui/react';

import usePrintParser from '@/hooks/usePrintParser';

import iconSet from '@/util/icons';

export default function QueueTableItem({ printData, startPrint, canQueue }) {
    const { expandedPrintData, progressMessage, progressColor } = usePrintParser(printData);

    return (
        <Tr key={print._id}>
            <Td>
                <VStack
                    align="start"
                    justify="start"
                    spacing={1}
                >
                    <HStack>
                        <Text fontSize="md">{expandedPrintData.trayName}</Text>
                        <Badge
                            variant="subtle"
                            colorScheme={progressColor}
                        >
                            {progressMessage}
                        </Badge>
                    </HStack>
                    <Text
                        fontSize="xs"
                        color="gray.500"
                    >
                        {expandedPrintData.queuedAtExtendedFormatted}
                    </Text>
                </VStack>
            </Td>
            <Td>
                <Text fontSize="md">{expandedPrintData.estTimeFormatted}</Text>
            </Td>
            <Td>
                <ButtonGroup size="sm">
                    <Button
                        leftIcon={<Icon as={iconSet.play} />}
                        colorScheme="green"
                        variant="solid"
                        isDisabled={!canQueue}
                        onClick={() => startPrint(printData)}
                    >
                        Start
                    </Button>
                    <Button
                        leftIcon={<Icon as={iconSet.pencil} />}
                        colorScheme="orange"
                        variant="solid"
                    >
                        Edit
                    </Button>
                </ButtonGroup>
            </Td>
        </Tr>
    );
}
