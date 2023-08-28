import { Box, Grid, GridItem } from '@chakra-ui/react';

import ConfigNavigation from '@/components/config/SidebarNavigation';

export default function PrimaryLayout({ children }) {
    return (
        <>
            <Grid
                templateAreas={`"nav main"`}
                gridTemplateColumns="260px 1fr"
                gridTemplateRows="1fr"
                h="full"
                w="full"
                overflow="hidden"
            >
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
            </Grid>
        </>
    );
}
