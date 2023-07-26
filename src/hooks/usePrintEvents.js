import { useMemo } from 'react';

import { Avatar, AvatarBadge, Icon, useColorModeValue } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import iconSet from '@/util/icons';

export default function usePrintEvents(print) {
    const eventIcons = {
        queued: <Icon as={iconSet.pencil} />,
        completed: <Icon as={iconSet.check} />,
        failed: <Icon as={iconSet.stop} />,
        printing: <Icon as={iconSet.play} />
    };

    const eventColors = {
        queued: useColorModeValue('blue.600', 'blue.300'),
        completed: useColorModeValue('green.600', 'green.300'),
        failed: useColorModeValue('red.600', 'red.300'),
        printing: useColorModeValue('green.600', 'green.300')
    };

    const eventNames = {
        queued: 'Print queued',
        completed: 'Print completed',
        failed: 'Print failed',
        printing: 'Print started'
    };

    const detailedEvents = useMemo(() => {
        return print.events.map((event) => {
            return {
                ...event,
                description: eventNames[event.type],
                formattedTimestamp: dayjs.utc(event.timestamp).local().format('MM/DD h:mm A'),
                icon: (
                    <Avatar
                        size="sm"
                        icon={eventIcons[event.type]}
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
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [print.events]); //ignore this warning, this is a safe memoized value

    return { detailedEvents };
}
