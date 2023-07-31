import { useContext, useMemo } from 'react';

import PrintingContext from '@/contexts/printing/PrintingContext';

import { PrintStates } from '@/util/states';

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
        } else if (currentPrintData?.state === PrintStates.PRINTING) {
            state = 'printing';
        }

        return {
            ...printer,
            state: state,
            queueLength: queue.filter(
                (print) =>
                    print.printer === printer.id &&
                    (print.state === PrintStates.QUEUED || print.state === PrintStates.FAILED)
            ).length
        };
    }, [printer, currentPrintData, queue]);

    return {
        expandedPrinterData,
        printerTypeData,
        currentPrintData
    };
}
