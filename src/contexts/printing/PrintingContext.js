import { createContext, useCallback, useEffect, useState } from 'react';

import { HStack, Spinner, Text, useToast } from '@chakra-ui/react';

import useFocus from '@/hooks/useFocus';

const PrintingContext = createContext({});

function PrintingProvider({ children }) {
    const [queue, setQueue] = useState(null);
    const [printers, setPrinters] = useState(null);
    const [printerTypes, setPrinterTypes] = useState(null);

    const toast = useToast();
    const focus = useFocus();

    const refreshData = useCallback(() => {
        if (!focus) return;
        console.log('REFRESHING DATA');
        fetch('/api/printing/printerTypes', {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((data) => {
                setPrinterTypes((old) => {
                    if (JSON.stringify(old) !== JSON.stringify(data)) {
                        console.log('updated printer types');
                        return data;
                    } else {
                        return old;
                    }
                });
            })
            .catch((err) => {
                toast({
                    title: 'Fetch error',
                    description: `Couldn't fetch printer types: ${err.message}`,
                    status: 'error',
                    duration: 5000
                });
            });

        fetch('/api/printing/printers', {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((data) => {
                setPrinters((old) => {
                    if (JSON.stringify(old) !== JSON.stringify(data)) {
                        console.log('updated printers');
                        return data;
                    } else {
                        return old;
                    }
                });
            })
            .catch((err) => {
                toast({
                    title: 'Fetch error',
                    description: `Couldn't fetch printers: ${err.message}`,
                    status: 'error',
                    duration: 5000
                });
            });

        fetch('/api/printing/queue', {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((data) => {
                setQueue((old) => {
                    if (JSON.stringify(old) !== JSON.stringify(data)) {
                        console.log('updated queue');
                        return data;
                    } else {
                        return old;
                    }
                });
            })
            .catch((err) => {
                toast({
                    title: 'Fetch error',
                    description: `Couldn't fetch prints: ${err.message}`,
                    status: 'error',
                    duration: 5000
                });
            });
    }, [toast, focus]);

    useEffect(() => {
        refreshData();
        const int = setInterval(() => {
            refreshData();
        }, 2000);

        return () => {
            clearInterval(int);
        };
    }, [refreshData]);

    return (
        <PrintingContext.Provider value={{ queue, printers, printerTypes, refreshData }}>
            {queue && printers && printerTypes ? (
                <>{children}</>
            ) : (
                <HStack
                    w="100%"
                    h="100vh"
                    justify="center"
                    align="center"
                    spacing={3}
                >
                    <Spinner />
                    <Text>Fetching data...</Text>
                </HStack>
            )}
        </PrintingContext.Provider>
    );
}

export default PrintingContext;
export { PrintingProvider };
