import { useCallback, useEffect, useMemo, useState } from 'react';

import dayjs from '@/lib/time';

import { PrintStates } from '@/util/states';

export default function usePrintProgress(printData) {
    const [trueProgress, setTrueProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [complete, setComplete] = useState(false);

    const startTime = useMemo(() => {
        if (!printData) return null;
        return dayjs.utc(printData.events.find((e) => e.type === 'printing')?.timestamp);
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
            let remainingFormatted = remaining.add({ minutes: 1 }).format('HH:mm');

            let progress = Math.floor((elapsed / total) * 100);

            if (remaining.asSeconds() <= 0) {
                setComplete(true);
                remainingFormatted = '00:00';
                progress = 99;
            } else {
                setComplete(false);
            }

            setTrueProgress(progress);
            setTimeLeft(remainingFormatted);
        }
    }, [startTime, endTime]);

    useEffect(() => {
        if (!printData) return;
        if (printData.state === PrintStates.PRINTING) {
            update();
            const interval = setInterval(() => {
                update();
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setTrueProgress(0);
            setTimeLeft(0);
            setComplete(false);
        }
    }, [update, printData]);

    const progress = useMemo(() => {
        if (!printData) return 0;
        return printData.state === PrintStates.FAILED || printData.state === PrintStates.COMPLETED ? 100 : trueProgress;
    }, [printData, trueProgress]);

    const progressBarColor = useMemo(() => {
        if (!printData) return 'gray';
        if (printData.state === PrintStates.FAILED) {
            return 'red';
        } else if (printData.state === PrintStates.COMPLETED) {
            return 'green';
        } else if (complete) {
            return 'yellow';
        } else if (printData.state === PrintStates.PRINTING) {
            return 'blue';
        } else {
            return 'gray';
        }
    }, [printData, complete]);

    const progressMessageColor = useMemo(() => {
        if (!printData) return 'gray';
        if (printData.state === PrintStates.FAILED) {
            return 'red';
        } else if (printData.state === PrintStates.COMPLETED) {
            return 'green';
        } else if (complete) {
            return 'yellow';
        } else if (printData.state === PrintStates.PRINTING) {
            return 'green';
        } else {
            return 'gray';
        }
    }, [printData, complete]);

    const progressMessage = useMemo(() => {
        if (!printData) return 'unknown';
        if (printData.state === PrintStates.FAILED) {
            return 'failed';
        } else if (complete && printData.state !== PrintStates.COMPLETED) {
            return 'waiting';
        } else if (printData.state === PrintStates.COMPLETED) {
            return 'completed';
        } else if (printData.state === PrintStates.PRINTING) {
            return `${timeLeft} left`;
        } else if (printData.state === PrintStates.QUEUED) {
            return 'queued';
        }
    }, [complete, printData, timeLeft]);

    return { progress, timeLeft, complete, progressBarColor, progressMessage, progressMessageColor };
}
