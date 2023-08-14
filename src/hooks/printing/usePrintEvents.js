import { useMemo } from 'react';

import { Avatar, AvatarBadge, Icon, useColorMode, useColorModeValue } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

export default function usePrintEvents(print) {
    const eventIcons = {
        [PrintStates.QUEUED]: iconSet.pencil,
        [PrintStates.COMPLETED]: iconSet.check,
        [PrintStates.FAILED]: iconSet.stop,
        [PrintStates.PRINTING]: iconSet.play,
        [PrintStates.CANCELED]: iconSet.minus
    };

    const eventColors = {
        [PrintStates.QUEUED]: useColorModeValue('blue.600', 'blue.300'),
        [PrintStates.COMPLETED]: useColorModeValue('green.600', 'green.300'),
        [PrintStates.FAILED]: useColorModeValue('red.600', 'red.300'),
        [PrintStates.PRINTING]: useColorModeValue('green.600', 'green.300'),
        [PrintStates.CANCELED]: useColorModeValue('red.600', 'red.300')
    };

    const eventNames = {
        [PrintStates.QUEUED]: 'Print queued',
        [PrintStates.COMPLETED]: 'Print completed',
        [PrintStates.FAILED]: 'Print failed',
        [PrintStates.PRINTING]: 'Print started',
        [PrintStates.CANCELED]: 'Print canceled'
    };

    const eventOrder = {
        [PrintStates.QUEUED]: [PrintStates.PRINTING, PrintStates.COMPLETED],
        [PrintStates.PRINTING]: [PrintStates.COMPLETED],
        [PrintStates.FAILED]: [PrintStates.PRINTING, PrintStates.COMPLETED],
        [PrintStates.COMPLETED]: [],
        [PrintStates.CANCELED]: []
    };

    const expectedIconColor = useColorModeValue('black', 'white');
    const colorMode = useColorMode();

    const detailedEvents = useMemo(() => {
        if (!print) return [];
        let newEvents = [...print.events];
        return newEvents
            .map((event) => {
                return {
                    ...event,
                    description: eventNames[event.type],
                    formattedTimestamp: dayjs.utc(event.timestamp).local().format('MM/DD h:mm A'),
                    humanizedTimestamp: dayjs.duration(dayjs.utc(event.timestamp).diff(dayjs().utc())).humanize(true),
                    icon: (
                        <Avatar
                            size="sm"
                            icon={<Icon as={eventIcons[event.type]} />}
                            bgColor={eventColors[event.type]}
                        >
                            {event?.notes?.length > 0 && (
                                <AvatarBadge
                                    bg="yellow.300"
                                    boxSize="1em"
                                    placement="top-end"
                                />
                            )}
                        </Avatar>
                    )
                };
            })
            .sort((a, b) => {
                return dayjs.utc(a.timestamp).diff(dayjs.utc(b.timestamp)); //sort so newest at top
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [print?.events]); //ignore this warning, this is a safe memoized value

    const expectedEvents = useMemo(() => {
        if (!print) return [];
        return eventOrder[print.state].map((type) => {
            return {
                type,
                description: eventNames[type],
                icon: (
                    <Avatar
                        size="sm"
                        icon={
                            <Icon
                                as={eventIcons[type]}
                                color={expectedIconColor}
                            />
                        }
                        bgColor="transparent"
                        borderColor={eventColors[type]}
                        borderWidth={2}
                    />
                )
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [print, colorMode]);

    return { expectedEvents, detailedEvents };
}
