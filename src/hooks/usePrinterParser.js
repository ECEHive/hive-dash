import { useMemo, useContext } from 'react';
import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

export default function usePrintParser(printer) {
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
            state: state
        };
    }, [printer, currentPrintData]);

    return {
        expandedPrinterData,
        currentPrintData
    };
}
