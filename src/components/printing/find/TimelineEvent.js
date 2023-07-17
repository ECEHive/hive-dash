import { Box, HStack, VStack, Heading, Text } from '@chakra-ui/react';
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';

export default function TimelineEvent({ topEnd, bottomEnd, message }) {
    return (
        <Box w="100%" h="auto">
            <HStack w="100%" h="100%">
                <VStack w="25px" h="100%" spacing={1}>
                    <Box
                        w="2px"
                        bgColor="gray.400"
                        h="50%"
                        visibility={topEnd ? 'hidden' : 'visible'}
                    />
                    <CheckCircleIcon color="green.200" h={5} w={5} />
                    <Box
                        w="2px"
                        bgColor="gray.400"
                        h="50%"
                        visibility={bottomEnd ? 'hidden' : 'visible'}
                    />
                </VStack>
                <VStack align="start" spacing={1} p={3}>
                    <Heading
                        fontFamily="body"
                        size="md"
                        fontWeight="medium"
                    >
                        {message}
                    </Heading>
                    <Text fontSize="sm" color="gray.400">
                        10/23/2023 11:35 am
                    </Text>
                </VStack>
            </HStack>
        </Box>
    );
}
