import { useState, useMemo, useCallback, useEffect } from 'react';
import dayjs from '@/lib/time';

export default function usePrintProgress(printData) {
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    const startTime = useMemo(() => {
        return dayjs.utc(
            printData.events.find((e) => e.type === 'printing').timestamp
        );
    }, [printData]);

    const endTime = useMemo(() => {
        let end = startTime.add(dayjs.duration(printData.estTime));
        return end;
    }, [printData, startTime]);

    const update = useCallback(() => {
        const now = dayjs.utc();
        const total = endTime.diff(startTime);
        const elapsed = now.diff(startTime);
        const remaining = dayjs.duration(endTime.diff(now)).add({minutes: 1}).format('HH:mm');

        const progress = Math.floor(elapsed / total * 100);

        setProgress(progress);
        setTimeLeft(remaining);
    }, [startTime, endTime]);

    useEffect(() => {
        update();
        const interval = setInterval(update, 30000);
        return () => clearInterval(interval);
    }, [update]);

    return [progress, timeLeft];
}
