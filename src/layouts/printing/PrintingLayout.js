import { Box, Grid, GridItem, VStack } from '@chakra-ui/react';

import { PrintingProvider } from '@/contexts/printing/PrintingContext';

import Footer from '@/components/Footer';
import SiteBanner from '@/components/SiteBanner';
import TopBar from '@/components/TopBarNavigation';
import PrintingNavigation from '@/components/printing/SidebarNavigation';

export default function PrintingLayout({ children }) {
    return (
        <>
            <PrintingProvider>
                <Grid
                    templateAreas={`"header header"
                        "nav main"
                        "footer footer"`}
                    gridTemplateColumns="260px 1fr"
                    gridTemplateRows="80px 1fr 1.5rem"
                    h="100vh"
                    maxH="100vh"
                    w="full"
                    overflow="hidden"
                >
                    <GridItem area="header">
                        <TopBar />
                    </GridItem>

                    <GridItem area="nav">
                        <PrintingNavigation />
                    </GridItem>

                    <GridItem
                        area="main"
                        overflow="hidden"
                    >
                        <VStack
                            w="full"
                            h="full"
                            pos="relative"
                            justify="start"
                            align="start"
                            spacing={0}
                            overflow="hidden"
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
                    </GridItem>

                    <GridItem area="footer">
                        <Footer />
                    </GridItem>
                </Grid>
            </PrintingProvider>
        </>
    );
}
