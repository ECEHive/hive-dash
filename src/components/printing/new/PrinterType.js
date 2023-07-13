import {
    Card,
    Button,
    CardBody,
    VStack,
    Heading,
    Text,
    useColorModeValue
} from '@chakra-ui/react';

export default function PrinterType({ type }) {
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
                        <Heading size="md" fontWeight="medium">
                            {type}
                        </Heading>
                        <Text fontSize="md" fontWeight="normal">
                            Detailed, sturdy prints
                        </Text>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
