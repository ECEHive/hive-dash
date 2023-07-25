import { useCallback, useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Flex, VStack, useDisclosure } from '@chakra-ui/react';

import { PrintingProvider } from '@/contexts/printing/PrintingContext';

import TopBar from '@/components/TopBarNavigation';
import PrintingNavigation from '@/components/printing/SidebarNavigation';
import NewPrintModal from '@/components/printing/new/NewPrintModal';

export default function PrintingLayout({ children }) {
    const { isOpen: isNewPrintOpen, onOpen: onNewPrintOpen, onClose: onNewPrintClose } = useDisclosure();

    return (
        <>
            <PrintingProvider>
                {/* <NewPrintModal
                    isOpen={isNewPrintOpen}
                    onClose={onNewPrintClose}
                /> */}
                <Box
                    w="100vw"
                    h="100vh"
                    pos="fixed"
                >
                    <TopBar />
                    <PrintingNavigation />
                    <VStack
                        w="calc(100% - 260px)"
                        h="calc(100% - 80px)"
                        left="260px"
                        top="80px"
                        pos="relative"
                        justify="start"
                        align="start"
                    >
                        {/* <Alert status="error">
                            <AlertIcon />
                            <Box>
                                <AlertTitle>End of semester</AlertTitle>
                                <AlertDescription>
                                    3D Printing queues will be longer than
                                    expected leading up to the end of the
                                    semester.
                                </AlertDescription>
                            </Box>
                        </Alert> */}
                        <Box
                            w="100%"
                            h="100%"
                            overflow="hidden"
                        >
                            {children}
                        </Box>
                    </VStack>
                </Box>
            </PrintingProvider>
        </>
    );
}
