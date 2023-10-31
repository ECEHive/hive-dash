import { Grid, GridItem } from '@chakra-ui/react';

import Footer from '@/components/Footer';
import TopBar from '@/components/TopBarNavigation';

export default function GlobalLayout({ children }) {
    const pages = {
        printing: '3D Printing',
        config: 'Configuration'
    };

    return (
        <>
            <Grid
                templateAreas={`"header"
                        "main"
                        "footer"`}
                gridTemplateColumns="1fr"
                gridTemplateRows="70px 1fr 1.5rem"
                h="100vh"
                maxH="100vh"
                w="full"
                overflow="hidden"
            >
                <GridItem area="header">
                    <TopBar pages={pages} />
                </GridItem>

                <GridItem
                    area="main"
                    overflow="hidden"
                >
                    {children}
                </GridItem>

                <GridItem area="footer">
                    <Footer />
                </GridItem>
            </Grid>
        </>
    );
}
