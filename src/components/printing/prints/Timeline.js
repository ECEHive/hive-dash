import { useEffect, useMemo } from 'react';

import { Avatar, Box, HStack, Progress, Text, VStack } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import usePrintEvents from '@/hooks/printing/usePrintEvents';

import { PrintStates } from '@/util/states';

function TimelineEvent({ event }) {
    return (
        <>
            <VStack
                position="absolute"
                left={event.last ? null : `${event.progress}%`}
                right={event.last ? 0 : null}
                top={0}
                align={event.last ? 'end' : 'start'}
                spacing={1}
            >
                <HStack>
                    <Avatar
                        bgColor={event.happened ? 'blue.200' : 'gray.600'}
                        size="xs"
                        icon={event.icon}
                    />
                </HStack>

                {event.type === PrintStates.QUEUED || event.next ? (
                    <VStack
                        align="start"
                        justify="start"
                        spacing={0}
                    >
                        <Text
                            fontSize="lg"
                            fontWeight="medium"
                        >
                            {event.description}
                        </Text>
                        <Text
                            fontSize="xs"
                            color="secondaryText"
                        >
                            {!event.happened && 'expected '} {event.humanizedTimestamp}
                        </Text>
                    </VStack>
                ) : null}
            </VStack>
        </>
    );
}

export default function Timeline({ print }) {
    const { detailedEvents } = usePrintEvents(print);

    const latest = useMemo(() => {
        return [...detailedEvents].reverse().find((event) => event.happened);
    }, [detailedEvents]);

    useEffect(() => {
        console.log(detailedEvents);
    }, [detailedEvents]);

    const progress = useMemo(() => {
        // find latest event
        const latestEvent = detailedEvents.find((event) => event.happened);

        // find next event
        const nextEvent = detailedEvents.find((event) => !event.happened);

        // find progress between them
        if (latestEvent && nextEvent) {
            // calculate how far we've progressed between the two events, and if we've passed the next event's estimate, just use the next event's progress
            const progress = Math.min(
                latestEvent.progress +
                    (nextEvent.progress - latestEvent.progress) *
                        (dayjs().diff(dayjs(latestEvent.timestamp)) /
                            dayjs(nextEvent.timestamp).diff(dayjs(latestEvent.timestamp))),
                nextEvent.progress
            );

            return progress;
        }

        if (
            detailedEvents.find((event) => event.type === PrintStates.COMPLETED || event.type === PrintStates.CANCELED)
        ) {
            return 100;
        }
    }, [detailedEvents]);

    // const timeSinceQueue = useMemo(() => {
    //     //calculate time since queued
    //     const queuedTime = dayjs(print.queuedAt);
    //     const now = dayjs();

    //     return dayjs.duration(now.diff(queuedTime)).format('HH:mm');
    // });

    return (
        <>
            <VStack
                w="full"
                h="auto"
                align="start"
                spacing={3}
            >
                <HStack w="full">
                    <VStack
                        spacing={0}
                        align="start"
                        justify="start"
                    >
                        <HStack fontSize="2xl">
                            {latest.icon}
                            <Text fontWeight="semibold">{latest.description}</Text>
                        </HStack>
                        <Text
                            fontSize="sm"
                            color="secondaryText"
                        >
                            {latest.humanizedTimestamp}
                        </Text>
                    </VStack>
                </HStack>
                <Box
                    w="full"
                    h="auto"
                    position="relative"
                >
                    <Progress
                        position="absolute"
                        left={0}
                        top={3}
                        transform="translateY(-50%)"
                        w="full"
                        size="xs"
                        value={progress}
                        borderRadius={5}
                    />
                    <HStack
                        position="relative"
                        w="full"
                        h="80px"
                    >
                        {/* events */}
                        {detailedEvents.map((event) => (
                            <TimelineEvent
                                key={event.timestamp}
                                event={event}
                            />
                        ))}

                        {/* {print.state !== PrintStates.COMPLETED && print.state !== PrintStates.CANCELED ? (
                            <Box
                                position="absolute"
                                left={progress + '%'}
                                top={6}
                                transform="translateX(-50%)"
                            >
                                <Text
                                    fontSize="2xs"
                                    lineHeight={1}
                                    color="secondaryText"
                                >
                                    {timeSinceQueue}
                                </Text>
                            </Box>
                        ) : null} */}
                    </HStack>
                </Box>
            </VStack>
        </>
    );
}
