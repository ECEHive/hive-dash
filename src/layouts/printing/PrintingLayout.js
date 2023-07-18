import { useState, useEffect, useCallback } from 'react';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Flex,
    useToast
} from '@chakra-ui/react';

import PrintingNavigation from '@/components/printing/SidebarNavigation';
import TopBar from '@/components/TopBarNavigation';
import PrintingContext from '@/contexts/PrintingContext';

export default function PrimaryLayout({ children }) {
    const toast = useToast();

    const [queue, setQueue] = useState([]);
    const [printers, setPrinters] = useState([]);
    const [printerTypes, setPrinterTypes] = useState([]);

    const refresh = useCallback(() => {
        fetch('/api/printing/printerTypes', {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((data) => {
                setPrinterTypes(data);
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
                setPrinters(data);
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
                setQueue(data);
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
        const int = setInterval(() => {
            refresh();
        }, 1000)

        return () => {
            clearInterval(int);
        }
    }, [refresh]);

    return (
        <>
            <PrintingContext.Provider value={{ queue, printers, printerTypes }}>
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
                        {children}
                    </Box>
                </Box>
            </PrintingContext.Provider>
        </>
    );
}
