import { Card, CardBody, VStack, Heading, Box } from '@chakra-ui/react';

export default function CardTemplate({ children, title }) {
    return (
        <Card key="stratasyses" variant="filled" borderRadius={10} h="100%">
            <CardBody h="100%">
                <VStack alignItems="flex-start" h="100%" w="100%" spacing={4}>
                    {title && (
                        <Heading size="lg" fontWeight="semibold">
                            {title}
                        </Heading>
                    )}

                    <Box w="100%" h="100%" overflow="auto">
                        {children}
                    </Box>
                </VStack>
            </CardBody>
        </Card>
    );
}
