import { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    Divider,
    Flex,
    VStack,
    useColorModeValue,
    Spacer
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

export default function SidebarTemplate({ pageData, baseUrl }) {
    const pathname = usePathname();
    const [pathPage, setPathPage] = useState('');

    useEffect(() => {
        setPathPage(pathname.split('/')[2]);
    }, [pathname]);

    useEffect(() => {
        console.log(pathPage)
    }, [pathPage])

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
            >
                <VStack p={2} h="100%">
                    {pageData && pageData.map((element, index) => {
                        if (element.type === 'button') {
                            return (
                                <Button
                                    variant="ghost"
                                    w="100%"
                                    justifyContent="flex-start"
                                    colorScheme={element?.colorScheme || 'gray'}
                                    as={NextLink}
                                    href={baseUrl+element.href}
                                    isActive={pathPage === element.href.replace('/', '')}
                                    leftIcon={element.icon}
                                    key={element.name}
                                >
                                    {element.name}
                                </Button>
                            );
                        } else if (element.type === 'divider'){
                            return (
                                <Divider key={index} />
                            );
                        } else if (element.type === 'spacer'){
                            return (
                                <Spacer key={index}/>
                            );
                        }
                    })}
                    hi
                </VStack>
            </Flex>
        </>
    );
}
