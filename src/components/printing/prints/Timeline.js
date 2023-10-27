import { useEffect, useMemo } from 'react';

import {
    Avatar,
    AvatarBadge,
    Box,
    HStack,
    Icon,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Progress,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import dayjs from '@/lib/time';

import usePrintEvents from '@/hooks/printing/usePrintEvents';

import { PrintStates } from '@/util/states';

function TimelineEvent({ event }) {
    const avatarIncompleteColor = useColorModeValue('gray.200', 'gray.600');
    const avatarCompleteColor = useColorModeValue('blue.500', 'blue.200');

    const rtl = useMemo(() => {
        return event.progress > 50;
    }, [event.progress]);

    return (
        <>
            <Popover
                strategy="absolute"
                trigger="hover"
            >
                <PopoverTrigger>
                    <VStack
                        position="absolute"
                        left={rtl ? null : `${event.progress}%`}
                        right={rtl ? `${100 - event.progress}%` : null}
                        top={0}
                        align={rtl ? 'end' : 'start'}
                        spacing={1}
                        zIndex={event.happened ? 1 : 0}
                    >
                        <Avatar
                            bgColor={event.happened ? avatarCompleteColor : avatarIncompleteColor}
                            size="xs"
                            icon={<Icon as={event.icon} />}
                        >
                            {event?.notes?.length > 0 && (
                                <AvatarBadge
                                    bg="red.200"
                                    boxSize="1em"
                                />
                            )}
                        </Avatar>

                        {event.next || event.latest ? (
                            <VStack
                                align={rtl ? 'end' : 'start'}
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
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>{`${event.description} ${!event.happened ? '(expected) ' : ''}@ ${
                        event.formattedTimestamp
                    }`}</PopoverHeader>
                    {event?.notes && (
                        <PopoverBody>
                            <Text>{event.notes}</Text>
                        </PopoverBody>
                    )}
                </PopoverContent>
            </Popover>
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

            console.log(currentProgress, nextProgress);

            // find the progress between the two events
            const progress = Math.min(
                currentProgress +
                    ((nextProgress - currentProgress) * (dayjs().valueOf() - dayjs(latestEvent.timestamp).valueOf())) /
                        (dayjs(nextEvent.timestamp).valueOf() - dayjs(latestEvent.timestamp).valueOf()),
                nextProgress
            );

            return progress;
        }

        if (print.state === PrintStates.COMPLETED || print.state === PrintStates.CANCELED) {
            return 100;
        }
    }, [detailedEvents, print.state]);

    const tall = useMemo(() => {
        return detailedEvents.find((event) => event.next || event.latest);
    }, [detailedEvents]);

    return (
        <>
            <VStack
                w="full"
                h="auto"
                align="start"
                spacing={3}
                pos="relative"
            >
                <HStack w="full">
                    <VStack
                        spacing={0}
                        align="start"
                        justify="start"
                    >
                        <HStack fontSize="xl">
                            <Icon as={latest.icon} />
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
                        h={tall ? '80px' : '40px'}
                    >
                        {/* events */}
                        {detailedEvents.map((event) => (
                            <TimelineEvent
                                key={event.timestamp}
                                event={event}
                            />
                        ))}
                    </HStack>
                </Box>
            </VStack>
        </>
    );
}
