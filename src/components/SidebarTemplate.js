import {
    Divider,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    HStack,
    Icon,
    IconButton,
    Spacer,
    Tooltip,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import NextLink from 'next/link';

import { useAuth } from '@/contexts/AuthContext';
import useNav from '@/contexts/NavContext';

function Navigation({ pageData, baseUrl, pathPage }) {
    const { roleId } = useAuth();

    return (
        <VStack
            p={2}
            h="100%"
        >
            {pageData &&
                pageData.map((element, index) => {
                    if (roleId < element?.minRole) {
                        return null;
                    }
                    if (element.type === 'button') {
                        const active = pathPage === element?.href?.replace('/', '') || false;
                        return (
                            <>
                                {element.href ? (
                                    <>
                                        <HStack
                                            w="full"
                                            justify="center"
                                        >
                                            <Tooltip
                                                label={element.name}
                                                placement="right"
                                                hasArrow
                                            >
                                                <IconButton
                                                    size="lg"
                                                    icon={<Icon as={element.icon} />}
                                                    variant={active ? 'solid' : 'ghost'}
                                                    colorScheme={active ? 'twitter' : element?.colorScheme}
                                                    as={NextLink}
                                                    href={baseUrl + element.href}
                                                    isActive={active}
                                                    key={element.href}
                                                />
                                            </Tooltip>
                                        </HStack>
                                    </>
                                ) : (
                                    <>
                                        <HStack
                                            w="full"
                                            justify="center"
                                        >
                                            <Tooltip
                                                label={element.name}
                                                placement="right"
                                                hasArrow
                                            >
                                                <IconButton
                                                    size="lg"
                                                    icon={<Icon as={element.icon} />}
                                                    variant="ghost"
                                                    colorScheme={element?.colorScheme}
                                                    isActive={active}
                                                    key={element.href}
                                                    onClick={element.onClick}
                                                />
                                            </Tooltip>
                                        </HStack>
                                    </>
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
                key={page}
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
