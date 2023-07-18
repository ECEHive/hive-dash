import {
    Card,
    Button,
    CardBody,
    VStack,
    Heading,
    Text,
    HStack,
    Badge,
    useColorModeValue
} from '@chakra-ui/react';
import usePrinterParser from '@/hooks/usePrinterParser';

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
                                {data.displayName}
                            </Heading>
                            <Badge colorScheme="green" variant="subtle">
                                {data.status.state}
                            </Badge>
                        </HStack>
                        <Text fontSize="md" fontWeight="normal">
                            X prints in queue
                        </Text>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
