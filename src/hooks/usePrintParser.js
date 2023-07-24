import { useContext, useMemo } from 'react';
import { BsCheck, BsPencilFill, BsPlayFill, BsStopFill } from 'react-icons/bs';
import { FaPencilAlt } from 'react-icons/fa';

import { Avatar, useColorModeValue } from '@chakra-ui/react';

import { AddIcon, CheckCircleIcon, CheckIcon, DownloadIcon, WarningIcon, WarningTwoIcon } from '@chakra-ui/icons';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

import usePrintProgress from './usePrintProgress';

export default function usePrintParser(print) {
    const eventIcons = {
        queued: <BsPencilFill fontSize={14} />,
        completed: <BsCheck fontSize={26} />,
        failed: <BsStopFill fontSize={22} />,
        printing: <BsPlayFill fontSize={22} />
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

    const { printers, printerTypes } = useContext(PrintingContext);

    // maybe? MOVE PROGRESS TRACKING TO ITS OWN SEPARATE THING TO REDUCE OVERHEAD
    const [progress, timeLeft, complete] = usePrintProgress(print);

    const printerData = useMemo(() => {
        if (!print) return null;
        return printers.find((p) => p.id === print.printer);
    }, [print, printers]);

    const printerTypeData = useMemo(() => {
        if (!printerData) return null;
        return printerTypes.find((t) => t.id === printerData.type);
    }, [printerData, printerTypes]);

    const expandedPrintData = useMemo(() => {
        if (!print) return null;
        return {
            ...print,
            //sprinkle in some useful data so i dont have to make it again later
            detailedEvents: print.events.map((event) => {
                return {
                    ...event,
                    description: eventNames[event.type],
                    formattedTimestamp: dayjs.utc(event.timestamp).local().format('MM/DD h:mm A'),
                    icon: (
                        <Avatar
                            cursor="pointer"
                            size="sm"
                            icon={eventIcons[event.type]}
                            bgColor={eventColors[event.type]}
                        />
                    )
                };
            }),
            failed: print.events[0].type === 'failed',
            latestEvent: print.events[0].type,
            estTimeFormatted: dayjs.duration(print.estTime).format('HH:mm'),
            queuedAtExtendedFormatted: dayjs.utc(print.queuedAt).local().format('MM/DD/YYYY h:mm A'),
            queuedAtFormatted: dayjs.utc(print.queuedAt).local().format('MM/DD/YYYY'),
            materialSymbol: printerTypeData?.materialUnits.symbol
        };
    }, [print, printerTypeData]);

    const fixedProgress = useMemo(() => {
        if (!expandedPrintData) return 0;
        return expandedPrintData.failed || expandedPrintData.completed ? 100 : progress;
    }, [expandedPrintData, progress]);

    const progressColor = useMemo(() => {
        if (!expandedPrintData) return 'gray';
        if (expandedPrintData.failed) {
            return 'red';
        } else if (print.completed) {
            return 'green';
        } else if (complete) {
            return 'yellow';
        } else if (print.printing) {
            return 'blue';
        } else if (expandedPrintData.latestEvent === 'queued') {
            return 'gray';
        } else {
            return 'gray';
        }
    }, [print, expandedPrintData, complete]);

    const progressMessage = useMemo(() => {
        if (!expandedPrintData) return 'unknown';
        if (expandedPrintData.failed) {
            return 'failed';
        } else if (complete && !expandedPrintData.completed) {
            return 'waiting';
        } else if (expandedPrintData.completed) {
            return 'completed';
        } else if (expandedPrintData.printing) {
            return `${timeLeft} left`;
        } else if (expandedPrintData.latestEvent === 'queued') {
            return 'queued';
        }
    }, [complete, expandedPrintData, timeLeft]);

    return {
        expandedPrintData,
        printerData,
        printerTypeData,
        progress,
        fixedProgress,
        timeLeft,
        complete,
        progressColor,
        progressMessage
    };
}
