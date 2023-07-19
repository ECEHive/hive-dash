import { useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from '@/lib/time';

export default function usePrintProgress(printData) {
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [complete, setComplete] = useState(false);

    const startTime = useMemo(() => {
        if (!printData) return null;
        return dayjs.utc(
            printData.events.find((e) => e.type === 'printing')?.timestamp
        );
    }, [printData]);

    const endTime = useMemo(() => {
        if (!startTime) return null;
        let end = startTime.add(dayjs.duration(printData.estTime));
        return end;
    }, [printData, startTime]);

    const update = useCallback(() => {
        if (startTime) {
            const now = dayjs.utc();
            const total = endTime.diff(startTime);
            const elapsed = now.diff(startTime);
            const remaining = dayjs.duration(endTime.diff(now));
            let remainingFormatted = remaining
                .add({ minutes: 1 })
                .format('HH:mm');

            if (remaining.asSeconds() <= 0) {
                setComplete(true);
                remainingFormatted = '00:00';
            } else {
                setComplete(false);
            }

            const progress = Math.floor((elapsed / total) * 100);

            setProgress(progress);
            setTimeLeft(remainingFormatted);
        }
    }, [startTime, endTime]);

    useEffect(() => {
        if (!printData) return;
        if (printData.printing) {
            update();
            const interval = setInterval(() => {
                update();
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setProgress(0);
            setTimeLeft(0);
            setComplete(false);
        }
    }, [update, printData]);

    return [progress, timeLeft, complete];
}
