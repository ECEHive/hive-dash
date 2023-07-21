import { useCallback, useEffect, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Flex,
    useToast
} from '@chakra-ui/react';

import PrintingContext from '@/contexts/printing/PrintingContext';

import TopBar from '@/components/TopBarNavigation';
import PrintingNavigation from '@/components/printing/SidebarNavigation';

export default function PrintingLayout({ children }) {
    const toast = useToast();

    const [queue, setQueue] = useState(null);
    const [printers, setPrinters] = useState(null);
    const [printerTypes, setPrinterTypes] = useState(null);

    const refreshData = useCallback(() => {
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
    }, [toast]);

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
        <>
            <PrintingContext.Provider
                value={{ queue, printers, printerTypes, refreshData }}
            >
                <Box w="100vw" h="100vh" pos="fixed">
                    <TopBar />
                    <PrintingNavigation />
                    <Box
                        w="calc(100% - 260px)"
                        h="calc(100% - 80px)"
                        left="260px"
                        top="80px"
                        pos="relative"
                    >
                        {/* <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>
                            End of semester
                        </AlertTitle>
                        <AlertDescription>
                            3D Printing queues will be longer than expected leading up to the end of the semester.
                        </AlertDescription>
                    </Alert> */}
                        {queue && printers && printerTypes ? (
                            <>{children}</>
                        ) : null}
                    </Box>
                </Box>
            </PrintingContext.Provider>
        </>
    );
}
