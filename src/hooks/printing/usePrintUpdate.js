import { useToast } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import useRequest from '../useRequest';

export default function usePrintUpdate(silent = false) {
    const toast = useToast();
    const request = useRequest();

    const { refreshDynamicData } = usePrinting();

    function update(printId, data) {
        data['updatedAt'] = dayjs().utc().toISOString();

        return new Promise((resolve, reject) => {
            request(`/api/printing/prints/${printId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((data) => {
                    refreshDynamicData();
                    if (!silent) {
                        toast({
                            description: 'Print updated',
                            status: 'success',
                            duration: 5000
                        });
                    }
                    resolve();
                })
                .catch((err) => {
                    toast({
                        description: `Couldn't update print: ${err}`,
                        status: 'error',
                        duration: 5000
                    });
                    reject(err);
                });
        });
    }

    function remove(printId) {
        return new Promise((resolve, reject) => {
            request(`/api/printing/prints/${printId}`, {
                method: 'DELETE'
            })
                .then((data) => {
                    refreshDynamicData();
                    if (!silent) {
                        toast({
                            description: 'Print deleted',
                            status: 'success',
                            duration: 5000
                        });
                    }
                    resolve();
                })
                .catch((err) => {
                    toast({
                        description: `Couldn't delete print: ${err}`,
                        status: 'error',
                        duration: 5000
                    });
                    reject(err);
                });
        });
    }

    return { update, remove };
}
