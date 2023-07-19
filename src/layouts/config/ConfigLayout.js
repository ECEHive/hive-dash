import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Flex
} from '@chakra-ui/react';

import TopBar from '@/components/TopBarNavigation';
import ConfigNavigation from '@/components/config/SidebarNavigation';

export default function PrimaryLayout({ children }) {
    return (
        <>
            <Box w="100vw" h="100vh" pos="fixed">
                <TopBar />
                <ConfigNavigation />
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
        </>
    );
}
