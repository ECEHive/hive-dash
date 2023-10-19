import { useToast } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import useRequest from '../useRequest';

export default function usePrintUpdate(silent = false) {
    const toast = useToast();
    const request = useRequest();

    const { refreshDynamicData } = usePrinting();

    function update(printId, data, removeFromQueue = false) {
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
                    if (removeFromQueue) {
                        request(`/api/printing/queue/${printId}`, {
                            method: 'DELETE'
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
                                console.log('reject');
                                reject(err);
                            });
                    } else {
                        resolve();
                    }
                })
                .catch((err) => {
                    console.log('reject');
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
                    console.log('reject');
                    reject(err);
                });
        });
    }

    return { update, remove };
}
