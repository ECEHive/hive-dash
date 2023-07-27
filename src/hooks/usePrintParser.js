import { useContext, useMemo } from 'react';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

import { PrintStates } from '@/util/states';

export default function usePrintParser(print) {
    const { printers, printerTypes } = useContext(PrintingContext);

    const printerData = useMemo(() => {
        if (!print) return null;
        return printers.find((p) => p.id === print.printer);
    }, [print, printers]);

    const printerTypeData = useMemo(() => {
        if (!printerData) return null;
        return printerTypes.find((t) => t.id === printerData.type);
    }, [printerData, printerTypes]);

    const betterPrintData = useMemo(() => {
        if (!print) return null;
        return {
            ...print,
            stateName: Object.keys(PrintStates).find((key) => PrintStates[key] === print.state),

            updatedAtHumanized: dayjs.duration(dayjs.utc(print.updatedAt).diff(dayjs().utc())).humanize(true),

            estTimeFormatted: dayjs.duration(print.estTime).format('HH:mm'),

            queuedAtExtendedFormatted: dayjs.utc(print.queuedAt).local().format('MM/DD/YYYY h:mm A'),
            queuedAtFormatted: dayjs.utc(print.queuedAt).local().format('MM/DD/YYYY'),
            queuedAtHumanized: dayjs.duration(dayjs.utc(print.queuedAt).diff(dayjs().utc())).humanize(true),

            materialSymbol: printerTypeData?.materialUnits.symbol
        };
    }, [print, printerTypeData]);

    return {
        betterPrintData,
        printerData,
        printerTypeData
    };
}
