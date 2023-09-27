import { useToast } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import useRequest from '../useRequest';

export default function usePrinterUpdate(silent = false) {
    const toast = useToast();
    const request = useRequest();

    const { refreshDynamicData } = usePrinting();

    function update(printerId, printerData) {
        printerData['updatedAt'] = dayjs().utc().toISOString();

        return new Promise((resolve, reject) => {
            request(`/api/printing/printers/${printerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(printerData)
            })
                .then((data) => {
                    refreshDynamicData();
                    if (!silent) {
                        toast({
                            title: `${printerData.displayName} updated`,
                            //description: 'Printer updated',
                            status: 'success',
                            duration: 5000
                        });
                    }
                    resolve();
                })
                .catch((err) => {
                    toast({
                        title: 'Error',
                        description: `Couldn't update printer: ${err}`,
                        status: 'error',
                        duration: 5000
                    });
                    reject(err);
                });
        });
    }

    return update;
}
