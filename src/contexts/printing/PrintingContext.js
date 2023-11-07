import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { HStack, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';

import useFocus from '@/hooks/useFocus';
import useRequest from '@/hooks/useRequest';

import NewPrintModal from '@/components/printing/new/NewPrintModal';

const PrintingContext = createContext({});

function usePrinting() {
    return useContext(PrintingContext);
}

function PrintingProvider({ children }) {
    const request = useRequest();

    const [staticQueue, setStaticQueue] = useState(null);
    const [printers, setPrinters] = useState(null);
    const [printerTypes, setPrinterTypes] = useState(null);

    const [peerInstructors, setPeerInstructors] = useState(null);

    const toast = useToast();
    const focus = useFocus();

    const refreshDynamicData = useCallback(() => {
        if (!focus) return;
        console.log('REFRESHING DATA');
        request('/api/printing/printerTypes', {
            method: 'GET'
        })
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

        request('/api/printing/printers', {
            method: 'GET'
        })
            .then((data) => {
                const sorted = data.sort((a, b) => {
                    if (a.type < b.type) {
                        return 1;
                    }
                    if (a.type > b.type) {
                        return -1;
                    }
                    return 0;
                });
                setPrinters((old) => {
                    if (JSON.stringify(old) !== JSON.stringify(sorted)) {
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

        request('/api/printing/queue', {
            method: 'GET'
        })
            .then((data) => {
                setStaticQueue((old) => {
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
    }, [toast, focus, request]);

    const queue = useMemo(() => {
        if (staticQueue) {
            return JSON.parse(JSON.stringify(staticQueue));
        }
    }, [staticQueue]);

    const refreshStaticData = useCallback(() => {
        request('/api/peerInstructors', {
            method: 'GET'
        })
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
    }, [toast, request]);

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
                    <Text>Fetching...</Text>
                </HStack>
            )}
        </PrintingContext.Provider>
    );
}

export default usePrinting;
export { PrintingProvider };
