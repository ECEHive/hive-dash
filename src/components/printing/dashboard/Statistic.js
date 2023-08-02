import { Card, CardBody, HStack, Icon, Text, VStack } from '@chakra-ui/react';

export default function Statistic({ name, value, icon }) {
    return (
        <Card
            variant="outline"
            borderRadius={10}
            w="100%"
            // bgColor={useColorModeValue('gray.200', 'gray.600')}
            flexGrow={1}
            h="100%"
            // h="115px"
        >
            <CardBody>
                <VStack
                    w="full"
                    align="start"
                    spacing={1}
                >
                    <HStack
                        fontSize="md"
                        color="secondaryText"
                    >
                        <Icon as={icon} />
                        <Text fontWeight="medium">{name}</Text>
                    </HStack>
                    <Text
                        fontWeight="semibold"
                        fontSize="3xl"
                    >
                        {value}
                    </Text>
                </VStack>
            </CardBody>
        </Card>
    );
}
