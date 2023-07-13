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

export default function PrinterItem(props) {
    return (
        <Card
            as={Button}
            variant="filled"
            h="auto"
            w="300px"
            p={0}
            bgColor={useColorModeValue('gray.200', 'gray.600')}
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
                                Ultimaker 1
                            </Heading>
                            <Badge colorScheme="green" variant="subtle">
                                Printing
                            </Badge>
                        </HStack>
                        <Text fontSize="md" fontWeight="normal">
                            3 prints in queue
                        </Text>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
