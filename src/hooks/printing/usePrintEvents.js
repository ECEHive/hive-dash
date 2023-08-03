import { useMemo } from 'react';

import { Avatar, AvatarBadge, Icon, useColorMode, useColorModeValue } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

export default function usePrintEvents(print) {
    const eventIcons = {
        queued: iconSet.pencil,
        completed: iconSet.check,
        failed: iconSet.stop,
        printing: iconSet.play,
        canceled: iconSet.minus
    };

    const eventColors = {
        queued: useColorModeValue('blue.600', 'blue.300'),
        completed: useColorModeValue('green.600', 'green.300'),
        failed: useColorModeValue('red.600', 'red.300'),
        printing: useColorModeValue('green.600', 'green.300'),
        canceled: useColorModeValue('red.600', 'red.300')
    };

    const eventNames = {
        queued: 'Print queued',
        completed: 'Print completed',
        failed: 'Print failed',
        printing: 'Print started',
        canceled: 'Print canceled'
    };

    const eventOrder = {
        [PrintStates.QUEUED]: ['printing', 'completed'],
        [PrintStates.PRINTING]: ['completed'],
        [PrintStates.FAILED]: ['printing', 'completed'],
        [PrintStates.COMPLETED]: [],
        [PrintStates.CANCELED]: []
    };

    const expectedIconColor = useColorModeValue('black', 'white');
    const colorMode = useColorMode();

    const detailedEvents = useMemo(() => {
        if (!print) return [];
        return print.events
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
                return dayjs.utc(b.timestamp).diff(dayjs.utc(a.timestamp)); //sort so newest at top
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [print?.events]); //ignore this warning, this is a safe memoized value

    const expectedEvents = useMemo(() => {
        if (!print) return [];
        console.log(expectedIconColor);
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
