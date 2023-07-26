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
import usePrintProgress from '@/hooks/usePrintProgress';

import iconSet from '@/util/icons';

export default function QueueTableItem({ printData, startPrint, canQueue }) {
    const { betterPrintData } = usePrintParser(printData);
    const { progressMessage, progressColor } = usePrintProgress(printData);

    return (
        <Tr key={print._id}>
            <Td>
                <VStack
                    align="start"
                    justify="start"
                    spacing={1}
                >
                    <HStack>
                        <Text fontSize="md">{betterPrintData.trayName}</Text>
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
                        {betterPrintData.queuedAtExtendedFormatted}
                    </Text>
                </VStack>
            </Td>
            <Td>
                <Text fontSize="md">{betterPrintData.estTimeFormatted}</Text>
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
