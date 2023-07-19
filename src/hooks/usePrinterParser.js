import { useContext, useMemo } from 'react';

import PrintingContext from '@/contexts/printing/PrintingContext';

import dayjs from '@/lib/time';

export default function usePrinterParser(printer) {
    const { queue } = useContext(PrintingContext);

    const currentPrintData = useMemo(() => {
        return queue.find((print) => print._id === printer.currentTray);
    }, [queue, printer]);

    const expandedPrinterData = useMemo(() => {
        let state = 'idle';
        if (!printer.enabled) {
            state = 'down';
        } else if (currentPrintData.printing) {
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
        currentPrintData
    };
}
