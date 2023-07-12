import { Box, Button, Center, Heading, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function PageNotFound() {
    return (
        <Box w="100%" h="100vh">
            <VStack
                w="100%"
                h="100%"
                spacing={4}
                alignItems="center"
                justifyContent="center"
            >
                <Heading size="lg" fontWeight="semibold">
                    page not found :(
                </Heading>
                <Button
                    as={NextLink}
                    variant="solid"
                    href="/printing/dashboard"
                >
                    Home
                </Button>
            </VStack>
        </Box>
    );
}
