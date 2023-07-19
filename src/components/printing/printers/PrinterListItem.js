import { useMemo } from 'react';

import {
    Badge,
    Button,
    Card,
    CardBody,
    CircularProgress,
    HStack,
    Heading,
    Spacer,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import usePrintParser from '@/hooks/usePrintParser';
import usePrinterParser from '@/hooks/usePrinterParser';

import getStateColor from '@/util/getStateColor';

export default function PrinterListItem({ data, onClick, isActive, queue }) {
    const { expandedPrinterData, currentPrintData } = usePrinterParser(data);
    const { expandedPrintData, timeLeft, progress } =
        usePrintParser(currentPrintData);

    const progressTrackColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <Card
            w="100%"
            minH="115px"
            as={Button}
            p={0}
            variant="filled"
            onClick={onClick}
            isActive={isActive}
        >
            <CardBody w="100%">
                <VStack spacing={0} alignItems="flex-start" h="100%">
                    <HStack w="100%">
                        <Heading
                            size="md"
                            fontWeight="medium"
                            fontFamily="body"
                        >
                            {data.displayName}
                        </Heading>
                        <Badge
                            variant="subtle"
                            colorScheme={getStateColor(
                                expandedPrinterData.state
                            )}
                        >
                            {expandedPrinterData.state}
                        </Badge>
                    </HStack>

                    <Spacer />

                    <HStack w="100%" justifyContent="flex-start" spacing={5}>
                        {/* <CircularProgress value={100} color="green.200" size={8} /> */}
                        {expandedPrinterData.state === 'printing' && (
                            <VStack alignItems="flex-start" spacing={0.5}>
                                <HStack spacing={1.5}>
                                    <CircularProgress
                                        value={progress}
                                        color="green.200"
                                        size={5}
                                        thickness={10}
                                        trackColor={progressTrackColor}
                                    />
                                    <Text
                                        fontSize="lg"
                                        fontWeight="semibold"
                                        lineHeight={1}
                                    >
                                        {timeLeft}
                                    </Text>
                                </HStack>
                                <Text fontSize="sm" fontWeight="normal">
                                    est. remaining
                                </Text>
                            </VStack>
                        )}
                        <VStack alignItems="flex-start" spacing={0.5}>
                            <Text fontSize="lg" fontWeight="semibold">
                                {expandedPrinterData.queueLength}
                            </Text>
                            <Text fontSize="sm" fontWeight="normal">
                                in queue
                            </Text>
                        </VStack>
                        {/* <VStack alignItems="flex-start" spacing={0}>
                                                <Text fontSize="lg" fontWeight="semibold">ABS</Text>
                                                <Text fontSize="xs" fontWeight="normal">material</Text>
                                            </VStack> */}
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
