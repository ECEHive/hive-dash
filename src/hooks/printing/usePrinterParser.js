import { useMemo } from 'react';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import { PrintStates } from '@/util/states';

export default function usePrinterParser(printer) {
    const { queue, printerTypes } = usePrinting();

    const printerTypeData = useMemo(() => {
        if (!printer) return null;
        //console.log(printerTypes.find((type) => type.id === printer.type));
        return printerTypes.find((type) => type.id === printer.type);
    }, [printerTypes, printer]);

    const currentPrintData = useMemo(() => {
        if (!printer) return null;
        return queue.find((print) => print._id === printer.currentTray);
    }, [queue, printer]);

    const expandedPrinterData = useMemo(() => {
        if (!printer) return null;
        let state = 'idle';
        if (!printer.enabled) {
            state = 'down';
        } else if (currentPrintData?.state === PrintStates.PRINTING) {
            state = 'printing';
        }

        return {
            ...printer,
            state: state,
            updatedAtHumanized: dayjs.duration(dayjs.utc(printer.updatedAt).diff(dayjs().utc())).humanize(true),
            queueLength: printer.queue.length
        };
    }, [printer, currentPrintData]);

    return {
        expandedPrinterData,
        printerTypeData,
        currentPrintData
    };
}
