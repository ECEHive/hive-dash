import { useEffect, useState } from 'react';

import { Button, Flex, HStack, Icon, IconButton, Spacer, useColorMode } from '@chakra-ui/react';

import NextImage from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import iconSet from '@/util/icons';

import logoDark from '@/assets/logo_dark.png';
import logoLight from '@/assets/logo_light.png';

export default function TopBarNavigation(props) {
    const { colorMode, toggleColorMode } = useColorMode();
    const [pathSection, setPathSection] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        if (pathname) {
            setPathSection(pathname.split('/')[1]);
        }
    }, [pathname]);

    return (
        <Flex
            direction="row"
            w="100%"
            h="full"
            borderBottom="1px solid"
            borderColor="chakra-border-color"
        >
            {/* intersection of sidebar/topbar */}
            <HStack
                w="260px"
                h="100%"
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={2}
                // borderRight="1px solid"
                borderColor="chakra-border-color"
            >
                <NextImage
                    alt="HIVE logo"
                    src={colorMode === 'dark' ? logoDark : logoLight}
                    height={45}
                    placeholder="blur"
                    priority
                />
            </HStack>

            <HStack
                w="auto"
                h="100%"
                flexGrow={1}
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                spacing={3}
                p={3}
            >
                <Button
                    variant="ghost"
                    as={NextLink}
                    href="/printing"
                    size="md"
                    isActive={pathSection === 'printing'}
                >
                    3D Printing
                </Button>
                <Spacer />
                <IconButton onClick={toggleColorMode}>
                    {colorMode === 'dark' ? <Icon as={iconSet.sun} /> : <Icon as={iconSet.moon} />}
                </IconButton>
                <IconButton
                    as={NextLink}
                    href="/config"
                    isActive={pathSection === 'config'}
                >
                    <Icon as={iconSet.settings} />
                </IconButton>
            </HStack>
        </Flex>
    );
}
