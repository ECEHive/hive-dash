import { Box, Flex } from "@chakra-ui/react";

import Navigation from "@/components/SidebarNavigation"
import TopBar from "@/components/TopBarNavigation"

export default function PrimaryLayout({ children }) {

    return (
        <>
            <TopBar />
            <Navigation />
            <Box w="calc(100vw - 260px)" h="100%" left="260px" top="100px" pos="relative">
                {children}
            </Box>
        </>
    )
}