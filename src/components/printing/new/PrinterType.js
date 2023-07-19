import {
    Button,
    Card,
    CardBody,
    Heading,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

export default function PrinterType({ data, onClick, isActive }) {
    return (
        <Card
            as={Button}
            variant="filled"
            h="auto"
            w="300px"
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
                        <Heading size="md" fontWeight="medium">
                            {data.displayName}
                        </Heading>
                        <Text fontSize="md" fontWeight="normal">
                            {data.description}
                        </Text>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
