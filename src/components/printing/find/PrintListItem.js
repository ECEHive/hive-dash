import {
    Badge,
    Button,
    Card,
    CardBody,
    HStack,
    Heading,
    Spacer,
    Text,
    Tooltip,
    VStack
} from '@chakra-ui/react';

import usePrintParser from '@/hooks/usePrintParser';

import getStateColor from '@/util/getStateColor';

export default function PrintListItem({ data, isActive, onClick }) {
    const { expandedPrintData, progressMessage, printerData } =
        usePrintParser(data);

    return (
        <Card
            w="100%"
            minH="115px"
            as={Button}
            p={0}
            variant="filled"
            isActive={isActive}
            onClick={onClick}
        >
            <CardBody w="100%">
                <VStack spacing={0} alignItems="flex-start" h="100%">
                    <HStack w="100%">
                        <Tooltip
                            label={expandedPrintData.trayName}
                            placement="top"
                        >
                            <Heading
                                size="md"
                                fontWeight="medium"
                                fontFamily="body"
                                overflow="hidden"
                                whiteSpace="nowrap"
                                textOverflow="ellipsis"
                            >
                                {expandedPrintData.trayName}
                            </Heading>
                        </Tooltip>
                        <Spacer />
                        <Badge
                            variant="subtle"
                            colorScheme={getStateColor(
                                expandedPrintData.latestEvent
                            )}
                        >
                            {expandedPrintData.latestEvent}
                        </Badge>
                    </HStack>

                    <Spacer />

                    <HStack w="100%" justifyContent="flex-start" spacing={5}>
                        {/* <CircularProgress value={100} color="green.200" size={8} /> */}
                        {/* <VStack alignItems="flex-start" spacing={0.5}>
                            <HStack spacing={1}>
                                <Text fontSize="lg" fontWeight="semibold">
                                    {expandedPrintData.queuedAtFormatted}
                                </Text>
                            </HStack>
                            <Text fontSize="sm" fontWeight="normal">
                                queue date
                            </Text>
                        </VStack> */}
                        <VStack alignItems="flex-start" spacing={0.5}>
                            <HStack spacing={1}>
                                <Text fontSize="lg" fontWeight="semibold">
                                    {printerData.displayName}
                                </Text>
                            </HStack>
                            <Text fontSize="sm" fontWeight="normal">
                                printer
                            </Text>
                        </VStack>
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
