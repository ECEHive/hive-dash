import { Flex, HStack, Button, Image, useColorModeValue, Spacer, IconButton, useColorMode} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import NextImage from "next/image";

import logo from "@/assets/logo.png"

export default function TopBarNavigation(props) {

    const {colorMode, toggleColorMode} = useColorMode()

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
                borderRight="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
            >
                <NextImage src={logo} height={50} placeholder="blur" priority />
            </HStack>

            <HStack
                w="auto"
                h="100%"
                flexGrow={1}
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                spacing={2}
                p={3}
            >   
                <Button variant="ghost" isActive>
                    3D Printing
                </Button>
                <Spacer />
                <IconButton onClick={toggleColorMode}>
                    {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
                </IconButton>
            </HStack>
        </Flex>
    )
}