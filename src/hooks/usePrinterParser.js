import { useContext, useMemo } from 'react';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

import States from '@/util/states';

export default function usePrinterParser(printer) {
    const { queue, printerTypes } = useContext(PrintingContext);

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
        } else if (currentPrintData?.state === States.PRINTING) {
            state = 'printing';
        }

        return {
            ...printer,
            state: state,
            queueLength: queue.filter((print) => print.printer === printer.id && !print.completed).length
        };
    }, [printer, currentPrintData, queue]);

    return {
        expandedPrinterData,
        printerTypeData,
        currentPrintData
    };
}
