import { useMemo, useContext } from 'react';
import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';
import usePrintProgress from './usePrintProgress';

export default function usePrintParser(print) {
    const { printers, printerTypes } = useContext(PrintingContext);

    const [progress, timeLeft, complete] = usePrintProgress(print);

    
    const printerData = useMemo(() => {
        return printers.find((p) => p.id === print.printer);
    }, [print, printers]);
    
    const printerTypeData = useMemo(() => {
        return printerTypes.find((t) => t.id === printerData.type);
    }, [printerData, printerTypes]);
    
    const expandedPrintData = useMemo(() => {
        return {
            ...print,
            //sprinkle in some useful data so i dont have to make it again later
            failed: print.events[0].type === 'failed',
            latestEvent: print.events[0].type,
            estTimeFormatted: dayjs.duration(print.estTime).format('HH:mm'),
            queuedAtExtendedFormatted: dayjs
            .utc(print.queuedAt)
            .local()
            .format('MM/DD/YYYY HH:mm'),
            queuedAtFormatted: dayjs
            .utc(print.queuedAt)
            .local()
            .format('MM/DD/YYYY'),
            materialSymbol: printerTypeData.materialUnits.symbol
        };
    }, [print, printerTypeData]);
    
    const fixedProgress = useMemo(() => {
        return expandedPrintData.failed || expandedPrintData.completed
            ? 100
            : progress;
    }, [expandedPrintData, progress]);

    const progressColor = useMemo(() => {
        if (expandedPrintData.failed) {
            return 'red';
        } else if (print.completed) {
            return 'green';
        } else if (complete) {
            return 'yellow';
        } else if (print.printing) {
            return 'blue';
        } else {
            return 'gray';
        }
    }, [print, expandedPrintData, complete]);

    const progressMessage = useMemo(() => {
        if (expandedPrintData.failed) {
            return 'failed';
        } else if (complete && !expandedPrintData.completed) {
            return 'waiting for confirmation';
        } else if (expandedPrintData.completed) {
            return 'completed';
        } else if (expandedPrintData.printing) {
            return `${timeLeft} left`;
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
