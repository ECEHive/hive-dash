import { Card, CardBody, VStack, Heading, Box } from "@chakra-ui/react";


export default function CardTemplate({ children, title }) {

    return (
        <Card
            key="stratasyses"
            variant="filled"
            borderRadius={10}
            h="100%"
        >
            <CardBody h="100%">
                <VStack alignItems="flex-start" h="100%" w="100%" spacing={4} overflow="auto">
                    {title && <Heading size="lg" fontWeight="semibold">{title}</Heading>}

                    {children}
                </VStack>
            </CardBody>
        </Card>
    )
}