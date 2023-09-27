import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSteps, useToast } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import useRequest from '@/hooks/useRequest';

import { PrintStates } from '@/util/states';

import GlobalLayout from '@/layouts/GlobalLayout';
import Layout from '@/layouts/PrintingLayout';

import NewPrintModal from '@/components/printing/new/NewPrintModal';

export default function NewPrint(props) {
    const { refreshDynamicData } = usePrinting();
    const toast = useToast();
    const request = useRequest();

    const [inputData, setInputData] = useState({
        printer: {
            type: '',
            name: '',
            id: ''
        },
        print: {
            name: '',
            time: '',
            material: '',
            materialUsage: ''
        },
        user: {
            firstname: '',
            lastname: '',
            email: '',
            assistingPI: ''
        }
    });
    const [enableNext, setEnableNext] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [queuePos, setQueuePos] = useState(0);

    const steps = useMemo(
        () => [
            {
                title: 'Printer',
                description: inputData.printer.name
            },
            {
                title: 'Print info'
            },
            {
                title: 'End user info'
            }
        ],
        [inputData]
    );

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length || 0
    });

    useEffect(() => {
        console.log(inputData);
    }, [inputData]);

    const submit = useCallback(() => {
        let timestamp = dayjs.utc();
        let duration = dayjs
            .duration({
                hours: inputData.print.time.split(':')[0],
                minutes: inputData.print.time.split(':')[1]
            })
            .toISOString();
        const payload = {
            trayName: inputData.print.name,
            printer: inputData.printer.id,
            estTime: duration,
            materialType: inputData.print.material,
            materialUsage: inputData.print.materialUsage,
            queuedBy: inputData.user.assistingPI,
            queuedAt: timestamp,
            notes: '',
            state: PrintStates.QUEUED,
            endUser: {
                firstname: inputData.user.firstname,
                lastname: inputData.user.lastname,
                email: inputData.user.email
            },
            events: [
                {
                    type: PrintStates.QUEUED,
                    timestamp: timestamp,
                    notes: ''
                }
            ]
        };

        request('/api/printing/queue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then((res) => {
                setQueuePos(res.queueLength);
                refreshDynamicData();
                setSubmitting(false);
            })
            .catch((err) => {
                toast({
                    title: 'Error',
                    description: `Couldn't queue the print: ${err.message}`,
                    status: 'error',
                    duration: 5000
                });
            });
    }, [inputData, toast, refreshDynamicData]);

    useEffect(() => {
        if (activeStep === 3) {
            setSubmitting(true);
            submit();
        }
    }, [activeStep, submit]);

    useEffect(() => {
        setEnableNext(false);
    }, [activeStep]);

    return (
        <>
            <NewPrintModal />
        </>
    );
}

NewPrint.getLayout = (page) => (
    <GlobalLayout>
        <Layout>{page}</Layout>
    </GlobalLayout>
);
