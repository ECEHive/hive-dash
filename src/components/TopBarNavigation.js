import { useEffect, useState } from "react";
import { Flex, HStack, Button, Image, useColorModeValue, Spacer, IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";

import logoDark from "@/assets/logo_dark.png"
import logoLight from "@/assets/logo_light.png"

export default function TopBarNavigation(props) {

    const { colorMode, toggleColorMode } = useColorMode()
    const [pathSection, setPathSection] = useState("")
    const pathname = usePathname()

    useEffect(() => {
        setPathSection(pathname.split("/")[1])
    }, [pathname])

    return (
        <Flex
            direction="row"
            w="100%"
            h="80px"
            position="fixed"
            borderBottom="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.700")}
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
                borderColor={useColorModeValue("gray.200", "gray.700")}
            >
                <NextImage alt="HIVE logo" src={colorMode === "dark" ? logoDark : logoLight} height={45} placeholder="blur" priority />
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
                    isActive={pathSection === "printing"}
                >
                    3D Printing
                </Button>
                <Button variant="ghost">
                    Laser Cutting
                </Button>
                <Spacer />
                <IconButton onClick={toggleColorMode}>
                    {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                </IconButton>
            </HStack>
        </Flex>
    )
}