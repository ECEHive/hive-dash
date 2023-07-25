import { useEffect, useState } from 'react';

import { Button, Divider, Flex, Spacer, VStack, useColorModeValue } from '@chakra-ui/react';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarTemplate({ pageData, baseUrl }) {
    const pathname = usePathname();
    const [pathPage, setPathPage] = useState('');

    useEffect(() => {
        console.log(pathname);
        if (pathname) {
            setPathPage(pathname.split('/')[2] || '');
        }
    }, [pathname]);

    useEffect(() => {
        console.log(pathPage);
    }, [pathPage]);

    return (
        <>
            <Flex
                direction="column"
                w="260px"
                h="calc(100% - 80px)"
                top="80px"
                position="fixed"
                borderRight="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                zIndex={500}
                bgColor={useColorModeValue('white', 'gray.800')}
            >
                <VStack
                    p={2}
                    h="100%"
                >
                    {pageData &&
                        pageData.map((element, index) => {
                            if (element.type === 'button') {
                                return (
                                    <Button
                                        variant="ghost"
                                        w="100%"
                                        size="md"
                                        justifyContent="flex-start"
                                        colorScheme={element?.colorScheme || 'gray'}
                                        as={NextLink}
                                        href={baseUrl + element.href}
                                        isActive={pathPage === element.href.replace('/', '')}
                                        leftIcon={element.icon}
                                        key={element.name}
                                    >
                                        {element.name}
                                    </Button>
                                );
                            } else if (element.type === 'divider') {
                                return <Divider key={index} />;
                            } else if (element.type === 'spacer') {
                                return <Spacer key={index} />;
                            }
                        })}
                    hi
                </VStack>
            </Flex>
        </>
    );
}
