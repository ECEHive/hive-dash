import { Box, HStack, VStack, Heading, Text } from '@chakra-ui/react';
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';

import dayjs from '@/lib/time';
import { useMemo, useEffect } from 'react';

export default function TimelineEvent({ topEnd, bottomEnd, event }) {

    useEffect(() => {
        console.log(event)
    }, [event])

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
                    {event.icon}
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
                        {event.type}
                    </Heading>
                    <Text fontSize="sm" color="gray.400">
                        {event.formattedTimestamp}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    );
}
