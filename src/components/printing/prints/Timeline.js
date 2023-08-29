import { useEffect, useMemo } from 'react';

import { Avatar, Box, HStack, Progress, Text, VStack, useColorModeValue } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import usePrintEvents from '@/hooks/printing/usePrintEvents';

import { PrintStates } from '@/util/states';

function TimelineEvent({ event }) {
    const avatarIncompleteColor = useColorModeValue('gray.200', 'gray.600');

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
                <Avatar
                    bgColor={event.happened ? 'blue.200' : avatarIncompleteColor}
                    size="xs"
                    icon={event.icon}
                />

                {event.next || event.latest ? (
                    <VStack
                        align={event.last ? 'end' : 'start'}
                        justify="start"
                        spacing={0}
                        w="full"
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
        let reversed = [...detailedEvents].reverse();
        // find latest event
        const latestEvent = reversed.find((event) => event.happened);

        // find next event
        const nextEvent = reversed.find((event) => event.next);

        // find progress between them
        if (latestEvent && nextEvent) {
            // calculate how far we've progressed between the two events, and if we've passed the next event's estimate, just use the next event's progress
            console.log(latestEvent, nextEvent);
            const nextProgress = nextEvent.progress;
            const currentProgress = latestEvent.progress;

            // find the progress between the two events
            const progress = Math.min(
                currentProgress +
                    ((nextProgress - currentProgress) * (dayjs().valueOf() - dayjs(latestEvent.timestamp).valueOf())) /
                        (dayjs(nextEvent.timestamp).valueOf() - dayjs(latestEvent.timestamp).valueOf()),
                100
            );

            return progress;
        }

        if (print.state === PrintStates.COMPLETED || print.state === PrintStates.CANCELED) {
            return 100;
        }
    }, [detailedEvents, print.state]);

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
                        <HStack fontSize="xl">
                            {latest.icon}
                            <Text
                                fontWeight="semibold"
                                fontSize="2xl"
                            >
                                {latest.description}
                            </Text>
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
