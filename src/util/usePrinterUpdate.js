import { useToast } from '@chakra-ui/react';

export default function usePrinterUpdate() {
    const toast = useToast();

    function update(printId, data) {
        fetch(`/api/printing/prints/${printId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((data) => {
                toast({
                    title: 'Success',
                    description: 'Print updated',
                    status: 'success',
                    duration: 5000
                });
            })
            .catch((err) => {
                toast({
                    title: 'Error',
                    description: `Couldn't update print: ${err}`,
                    status: 'error',
                    duration: 5000
                });
            });
    }

    return update;
}
