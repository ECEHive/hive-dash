import { Box, Flex } from "@chakra-ui/react";

import PrintingNavigation from "@/components/SidebarNavigation"
import TopBar from "@/components/TopBarNavigation"

export default function PrimaryLayout({ children }) {

    return (
        <>
            <Box w="100vw" h="100vh" pos="fixed">
                <TopBar />
                <PrintingNavigation />
                <Box w="calc(100vw - 260px)" h="calc(100vh - 80px)" left="260px" top="80px" pos="relative">
                    {children}
                </Box>
            </Box>
        </>
    )
}