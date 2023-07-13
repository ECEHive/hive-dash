import { Card, CardBody, useColorModeValue } from '@chakra-ui/react';

export default function InfoCard({ children }) {
    return (
        <Card
            w="auto"
            h="auto"
            variant="filled"
            bgColor={useColorModeValue('gray.200', 'gray.600')}
        >
            <CardBody>
                {children}
            </CardBody>
        </Card>
    );
}
