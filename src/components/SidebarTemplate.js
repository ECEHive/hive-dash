import {
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Spacer,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import NextLink from 'next/link';

import { useAuth } from '@/contexts/AuthContext';
import useNav from '@/contexts/NavContext';

function Navigation({ pageData, baseUrl, pathPage }) {
    const { isLoggedIn } = useAuth();

    return (
        <VStack
            p={2}
            h="100%"
        >
            {pageData &&
                pageData.map((element, index) => {
                    if (element.auth && !isLoggedIn) return null;
                    if (element.type === 'button') {
                        const active = pathPage === element?.href?.replace('/', '') || false;
                        return (
                            <>
                                {element.href ? (
                                    <Button
                                        // variant={active ? 'outline' : 'ghost'}
                                        variant="ghost"
                                        w="100%"
                                        size="md"
                                        justifyContent="flex-start"
                                        colorScheme={element?.colorScheme}
                                        as={NextLink}
                                        href={baseUrl + element.href}
                                        isActive={active}
                                        leftIcon={element.icon}
                                        key={element.name}
                                    >
                                        {element.name}
                                    </Button>
                                ) : (
                                    <Button
                                        // variant={active ? 'outline' : 'ghost'}
                                        variant="ghost"
                                        w="100%"
                                        size="md"
                                        justifyContent="flex-start"
                                        colorScheme={element?.colorScheme}
                                        onClick={element.onClick}
                                        leftIcon={element.icon}
                                        key={element.name}
                                    >
                                        {element.name}
                                    </Button>
                                )}
                            </>
                        );
                    } else if (element.type === 'divider') {
                        return <Divider key={index} />;
                    } else if (element.type === 'spacer') {
                        return <Spacer key={index} />;
                    }
                })}
            hi
        </VStack>
    );
}

export default function SidebarTemplate({ pageData, baseUrl }) {
    const { page } = useNav();

    return (
        <>
            <Flex
                direction="column"
                w="full"
                h="full"
                borderRight="1px solid"
                borderColor="chakra-border-color"
                zIndex={500}
                bgColor={useColorModeValue('white', 'gray.800')}
            >
                <Navigation
                    pageData={pageData}
                    baseUrl={baseUrl}
                    pathPage={page}
                />
            </Flex>
            <Drawer
                isOpen={false}
                size="xs"
                placement="left"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">3D Printing</DrawerHeader>
                    <DrawerBody px={0}>
                        <Navigation
                            pageData={pageData}
                            baseUrl={baseUrl}
                            pathPage={page}
                        />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
