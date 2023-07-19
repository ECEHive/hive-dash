import {
    Badge,
    Card,
    CardBody,
    HStack,
    Progress,
    Spacer,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import usePrintParser from '@/hooks/usePrintParser';

export default function PrintPreview({ actions, print }) {
    const {
        expandedPrintData,
        progress,
        timeLeft,
        complete,
        progressColor,
        progressMessage,
        fixedProgress
    } = usePrintParser(print);

    return (
        <Card
            w="100%"
            h="auto"
            variant="filled"
            bgColor={useColorModeValue('gray.200', 'gray.600')}
        >
            <CardBody>
                <HStack w="100%" spacing={5}>
                    <VStack w="100%" spacing={4}>
                        <VStack w="100%" spacing={2}>
                            <HStack w="100%">
                                <VStack
                                    alignItems="flex-start"
                                    h="100%"
                                    w="100%"
                                    spacing={0}
                                >
                                    <Text
                                        fontSize="xl"
                                        fontWeight="medium"
                                        lineHeight={1}
                                    >
                                        {expandedPrintData.trayName}
                                    </Text>
                                    <Text fontSize="sm">
                                        Queued by: {expandedPrintData.queuedBy}
                                    </Text>
                                </VStack>
                                <Spacer />
                                <Badge variant="subtle" alignSelf="flex-end">
                                    {progressMessage}
                                </Badge>
                            </HStack>
                            <Progress
                                w="100%"
                                value={fixedProgress}
                                size="sm"
                                borderRadius={5}
                                colorScheme={progressColor}
                            />
                        </VStack>

                        <HStack
                            justifyContent="flex-start"
                            alignItems="flex-end"
                            w="100%"
                            spacing={6}
                        >
                            <VStack alignItems="flex-start" spacing={0}>
                                <Text
                                    fontSize="3xl"
                                    fontWeight="semibold"
                                    lineHeight={1}
                                >
                                    {expandedPrintData.estTimeFormatted}
                                </Text>
                                <Text fontSize="md" fontWeight="normal">
                                    est. print time
                                </Text>
                            </VStack>
                            <VStack alignItems="flex-start" spacing={0}>
                                <HStack spacing={1}>
                                    <Text
                                        fontSize="3xl"
                                        fontWeight="semibold"
                                        lineHeight={1}
                                    >
                                        {expandedPrintData.materialUsage}
                                    </Text>
                                    <Text fontSize="sm" alignSelf="flex-end">
                                        {expandedPrintData.materialSymbol}
                                    </Text>
                                </HStack>
                                <Text fontSize="md" fontWeight="normal">
                                    est. material
                                </Text>
                            </VStack>
                            <VStack alignItems="flex-start" spacing={0}>
                                <Text
                                    fontSize="3xl"
                                    fontWeight="semibold"
                                    lineHeight={1}
                                >
                                    {expandedPrintData.materialType}
                                </Text>
                                <Text fontSize="md" fontWeight="normal">
                                    material type
                                </Text>
                            </VStack>

                            <Spacer />

                            {actions}
                        </HStack>
                    </VStack>
                </HStack>
            </CardBody>
        </Card>
    );
}
