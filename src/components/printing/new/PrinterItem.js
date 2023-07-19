import {
    Badge,
    Button,
    Card,
    CardBody,
    HStack,
    Heading,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import usePrinterParser from '@/hooks/usePrinterParser';

import getStateColor from '@/util/getStateColor';

export default function PrinterItem({ data, onClick, isActive }) {
    const { expandedPrinterData } = usePrinterParser(data);

    return (
        <Card
            as={Button}
            variant="filled"
            h="auto"
            w="100%"
            p={0}
            bgColor={useColorModeValue('gray.200', 'gray.600')}
            onClick={onClick}
            isActive={isActive}
        >
            <CardBody w="100%">
                <VStack
                    w="100%"
                    h="100%"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    <VStack
                        w="100%"
                        h="100%"
                        spacing={1}
                        alignItems="flex-start"
                    >
                        <HStack>
                            <Heading
                                size="md"
                                fontWeight="medium"
                                fontFamily="heading"
                            >
                                {expandedPrinterData.displayName}
                            </Heading>
                            <Badge
                                colorScheme={getStateColor(
                                    expandedPrinterData.state
                                )}
                                variant="subtle"
                            >
                                {expandedPrinterData.state}
                            </Badge>
                        </HStack>
                        <Text fontSize="md" fontWeight="normal">
                            {expandedPrinterData.queueLength} in queue
                        </Text>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
