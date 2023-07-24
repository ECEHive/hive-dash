import { useContext, useMemo } from 'react';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

export default function usePrinterParser(printer) {
    const { queue, printerTypes } = useContext(PrintingContext);

    const printerTypeData = useMemo(() => {
        console.log(printerTypes.find((type) => type.id === printer.type));
        return printerTypes.find((type) => type.id === printer.type);
    }, [printerTypes, printer]);

    const currentPrintData = useMemo(() => {
        return queue.find((print) => print._id === printer.currentTray);
    }, [queue, printer]);

    const expandedPrinterData = useMemo(() => {
        let state = 'idle';
        if (!printer.enabled) {
            state = 'down';
        } else if (currentPrintData?.printing) {
            state = 'printing';
        }

        return {
            ...printer,
            state: state,
            queueLength: queue.filter(
                (print) => print.printer === printer.id && !print.completed
            ).length
        };
    }, [printer, currentPrintData, queue]);

    return {
        expandedPrinterData,
        printerTypeData,
        currentPrintData
    };
}
