import { Box, Grid, GridItem, VStack } from '@chakra-ui/react';

import { PrintingProvider } from '@/contexts/printing/PrintingContext';

import SiteBanner from '@/components/SiteBanner';
import PrintingNavigation from '@/components/printing/SidebarNavigation';

export default function PrintingLayout({ children }) {
    return (
        <>
            <PrintingProvider>
                <Grid
                    templateAreas={`"nav main"`}
                    gridTemplateColumns="260px 1fr"
                    gridTemplateRows="1fr"
                    h="full"
                    w="full"
                    overflow="hidden"
                >
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
                </Grid>
            </PrintingProvider>
        </>
    );
}
