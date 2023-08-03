import { Box, Grid, GridItem } from '@chakra-ui/react';

import Footer from '@/components/Footer';
import TopBar from '@/components/TopBarNavigation';
import ConfigNavigation from '@/components/config/SidebarNavigation';

export default function PrimaryLayout({ children }) {
    return (
        <>
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
                    <ConfigNavigation />
                </GridItem>

                <GridItem
                    area="main"
                    overflow="hidden"
                >
                    <Box
                        w="full"
                        h="full"
                    >
                        {children}
                    </Box>
                </GridItem>

                <GridItem area="footer">
                    <Footer />
                </GridItem>
            </Grid>
        </>
    );
}
