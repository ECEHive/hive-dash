import { useContext } from 'react';

import { useToast } from '@chakra-ui/react';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

export default function usePrintUpdate(silent = false) {
    const toast = useToast();

    const { refreshData } = useContext(PrintingContext);

    function update(printId, data) {
        data['updatedAt'] = dayjs().utc().toISOString();

        return new Promise((resolve, reject) => {
            fetch(`/api/printing/prints/${printId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then((res) => res.json())
                .then((data) => {
                    refreshData();
                    if (!silent) {
                        toast({
                            title: 'Success',
                            description: 'Print updated',
                            status: 'success',
                            duration: 5000
                        });
                    }
                    resolve();
                })
                .catch((err) => {
                    toast({
                        title: 'Error',
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
            fetch(`/api/printing/prints/${printId}`, {
                method: 'DELETE'
            })
                .then((res) => res.json())
                .then((data) => {
                    refreshData();
                    if (!silent) {
                        toast({
                            title: 'Success',
                            description: 'Print deleted',
                            status: 'success',
                            duration: 5000
                        });
                    }
                    resolve();
                })
                .catch((err) => {
                    toast({
                        title: 'Error',
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
