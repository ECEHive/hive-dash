import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { HStack, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';

import useFocus from '@/hooks/useFocus';

import NewPrintModal from '@/components/printing/new/NewPrintModal';

const PrintingContext = createContext({});

function usePrinting() {
    return useContext(PrintingContext);
}

function PrintingProvider({ children }) {
    const [queue, setQueue] = useState(null);
    const [printers, setPrinters] = useState(null);
    const [printerTypes, setPrinterTypes] = useState(null);

    const [peerInstructors, setPeerInstructors] = useState(null);

    const toast = useToast();
    const focus = useFocus();

    const refreshDynamicData = useCallback(() => {
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
                    // this is hella inefficient?
                    let diff = data.filter((x) => !old.includes(x));
                    if (diff.length > 0 || old.length === 0) {
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

    const refreshStaticData = useCallback(() => {
        fetch('/api/peerInstructors', {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((data) => {
                setPeerInstructors(data.peerInstructors);
            })
            .catch((err) => {
                toast({
                    title: 'Fetch error',
                    description: `Couldn't fetch peer instructors: ${err.message}`,
                    status: 'error',
                    duration: 5000
                });
            });
    }, [toast]);

    useEffect(() => {
        refreshStaticData();
        refreshDynamicData();
        const int = setInterval(() => {
            refreshDynamicData();
        }, 5000);

        return () => {
            clearInterval(int);
        };
    }, [refreshDynamicData, refreshStaticData]);

    const { onOpen: onNewOpen, onClose: onNewClose, isOpen: isNewOpen } = useDisclosure();

    return (
        <PrintingContext.Provider
            value={{ queue, printers, printerTypes, refreshDynamicData, peerInstructors, onNewOpen }}
        >
            {queue && printers && printerTypes ? (
                <>
                    <NewPrintModal
                        isOpen={isNewOpen}
                        onClose={onNewClose}
                    />
                    {children}
                </>
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

export default usePrinting;
export { PrintingProvider };
