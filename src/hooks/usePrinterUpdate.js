import { useContext } from 'react';

import { useToast } from '@chakra-ui/react';

import PrintingContext from '@/contexts/printing/PrintingContext';

export default function usePrinterUpdate(silent = false) {
    const toast = useToast();

    const { refreshData } = useContext(PrintingContext);

    function update(printerId, printerData) {
        return new Promise((resolve, reject) => {
            fetch(`/api/printing/printers/${printerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(printerData)
            })
                .then((res) => res.json())
                .then((data) => {
                    refreshData();
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
