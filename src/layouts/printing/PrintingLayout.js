import { useCallback, useEffect, useMemo } from 'react';

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Flex, VStack, useDisclosure } from '@chakra-ui/react';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import { PrintingProvider } from '@/contexts/printing/PrintingContext';

import Footer from '@/components/Footer';
import SiteBanner from '@/components/SiteBanner';
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
                        h="calc(100% - 80px - 1.5rem)"
                        left="260px"
                        top="80px"
                        pos="relative"
                        justify="start"
                        align="start"
                        spacing={0}
                    >
                        <SiteBanner />
                        <Box
                            w="100%"
                            h="100%"
                            overflow="hidden"
                        >
                            {children}
                        </Box>
                    </VStack>
                    <Footer />
                </Box>
            </PrintingProvider>
        </>
    );
}
