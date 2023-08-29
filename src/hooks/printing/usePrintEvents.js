import { useMemo } from 'react';

import { Icon, useColorModeValue } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

import usePrintParser from './usePrintParser';
import usePrinterParser from './usePrinterParser';

export default function usePrintEvents(print) {
    const { queue } = usePrinting();

    const { betterPrintData, printerData } = usePrintParser(print);
    const { expandedPrinterData } = usePrinterParser(printerData);

    const eventIcons = {
        [PrintStates.QUEUED]: iconSet.download,
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
        [PrintStates.QUEUED]: 'Queued',
        [PrintStates.COMPLETED]: 'Completed',
        [PrintStates.FAILED]: 'Failed',
        [PrintStates.PRINTING]: 'Printing',
        [PrintStates.CANCELED]: 'Canceled'
    };

    const detailedEvents = useMemo(() => {
        if (!print) return [];
        let newEvents = [...print.events];

        const queuedTime = dayjs(print.queuedAt);
        let completedTime =
            newEvents.find((event) => event.type === PrintStates.COMPLETED || event.type === PrintStates.CANCELED)
                ?.timestamp || dayjs().toISOString();

        // estimate when the print will start
        if (print.state === PrintStates.QUEUED || print.state === PrintStates.FAILED) {
            // estimate when the print will start based on the sum of the estimated times of all the prints in the queue
            let estWait = dayjs.duration(0, 'seconds');

            expandedPrinterData.queue.forEach((job) => {
                if (dayjs(job.queuedAt).valueOf() > dayjs(print.queuedAt).valueOf()) return; //ignore jobs that were queued after this one
                if (job === print) return; //ignore this job
                estWait = estWait.add(dayjs.duration(job.estTime));
            });

            // if printer is printing, add the remaining time on the current print to estWait
            const current = queue.find((job) => job._id === expandedPrinterData.currentTray);
            console.log(current);
            if (current?.state === PrintStates.PRINTING) {
                const currentStartTime = [...current.events].find(
                    (event) => event.type === PrintStates.PRINTING
                ).timestamp;
                // calculate time remaining
                const currentRemaining = dayjs.duration(
                    dayjs(currentStartTime).add(dayjs.duration(current.estTime)).diff(dayjs())
                );

                console.log(currentRemaining);

                estWait = estWait.add(currentRemaining);
            }

            console.log(estWait);

            newEvents.push({
                type: PrintStates.PRINTING,
                timestamp: dayjs().add(estWait).toISOString(),
                passed: false
            });
        }

        // estimate when the print will complete
        if (
            print.state === PrintStates.PRINTING ||
            print.state === PrintStates.QUEUED ||
            print.state === PrintStates.FAILED
        ) {
            // estimate the time the print will complete based on when it started (or when it is estimated to start) printing and its duration
            let startTime = dayjs([...newEvents].find((event) => event.type === PrintStates.PRINTING).timestamp);
            let endTime = startTime.add(dayjs.duration(betterPrintData.estTime));

            completedTime = endTime.toISOString();

            newEvents.push({
                type: PrintStates.COMPLETED,
                timestamp: endTime.toISOString(),
                passed: false
            });
        }

        let progressedEvents = [...newEvents].sort((a, b) => {
            return dayjs.utc(a.timestamp).diff(dayjs.utc(b.timestamp)); //sort so newest at top
        });

        let previousProgress = 0;
        for (let index = 0; index < progressedEvents.length; index++) {
            const event = progressedEvents[index];
            let progress = 0;
            if (!event?.passed) {
                progress = Math.min(
                    (dayjs(event.timestamp).subtract(queuedTime).valueOf() /
                        dayjs(completedTime).subtract(queuedTime).valueOf()) *
                        100,
                    85
                );

                if (event.type !== PrintStates.QUEUED) {
                    progress = Math.max(previousProgress + 4, progress);
                }
                previousProgress = progress;
            }
            event.progress = progress;
        }

        return progressedEvents
            .map((event, index) => {
                return {
                    ...event,

                    happened: print.events.includes(event),
                    next: newEvents.find((e) => !print.events.includes(e)) === event,
                    progress: event.progress,
                    last: event.type === PrintStates.COMPLETED || event.type === PrintStates.CANCELED,

                    description: eventNames[event.type],
                    formattedTimestamp: dayjs.utc(event.timestamp).local().format('MM/DD h:mm A'),
                    humanizedTimestamp: dayjs.duration(dayjs.utc(event.timestamp).diff(dayjs().utc())).humanize(true),
                    icon: <Icon as={eventIcons[event.type]} />,
                    color: eventColors[event.type]
                };
            })
            .sort((a, b) => {
                return dayjs.utc(a.timestamp).diff(dayjs.utc(b.timestamp)); //sort so newest at top
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [print?.events]); //ignore this warning, this is a safe memoized value

    return { detailedEvents };
}
