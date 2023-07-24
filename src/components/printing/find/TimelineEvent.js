import { useEffect, useMemo } from 'react';

import { Box, HStack, Heading, Text, VStack } from '@chakra-ui/react';

import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';

import dayjs from '@/lib/time';

export default function TimelineEvent({ topEnd, bottomEnd, event }) {
    return (
        <Box
            w="100%"
            h="auto"
        >
            <HStack
                w="100%"
                h="100%"
                spacing={3}
            >
                <HStack
                    justify="center"
                    w="90px"
                >
                    <Text
                        fontSize="xs"
                        color="gray.400"
                    >
                        {event.formattedTimestamp}
                    </Text>
                </HStack>

                <VStack
                    w="25px"
                    //h={!topEnd && !bottomEnd ? '60px' : '40px'}
                    h="60px"
                    spacing={1}
                >
                    <Box
                        w="2px"
                        bgColor="gray.400"
                        h="50%"
                        visibility={topEnd ? 'hidden' : 'visible'}
                        borderBottomRadius={10}
                    />
                    {event.icon}
                    <Box
                        w="2px"
                        bgColor="gray.400"
                        h="50%"
                        visibility={bottomEnd ? 'hidden' : 'visible'}
                        borderTopRadius={10}
                    />
                </VStack>

                <HStack
                    justify="start"
                    w="160px"
                >
                    <Heading
                        fontFamily="body"
                        size="md"
                        fontWeight="medium"
                    >
                        {event.description}
                    </Heading>
                </HStack>
            </HStack>
        </Box>
    );
}
