import { Button, ButtonGroup, Divider, Flex, VStack, useColorModeValue } from "@chakra-ui/react";
import { AiFillDashboard, AiFillPrinter, AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";

export default function Navigation(props) {
    return (
        <>
            <Flex
                direction="column"
                w="260px"
                h="calc(100% - 80px)"
                top="80px"
                position="fixed"
                borderRight="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
            >

                <VStack
                    p={2}
                >
                    <Button variant="ghost" w="100%" justifyContent="flex-start" leftIcon={<AiOutlinePlus />}>
                        New print
                    </Button>

                    <Divider />

                    <Button
                        variant="ghost"
                        w="100%"
                        justifyContent="flex-start"
                        isActive
                        leftIcon={<AiFillDashboard />}
                    >
                        Dashboard
                    </Button>
                    <Button
                        variant="ghost"
                        w="100%"
                        justifyContent="flex-start"
                        leftIcon={<AiFillPrinter />}
                    >
                        Printers
                    </Button>
                    <Button
                        variant="ghost"
                        w="100%"
                        justifyContent="flex-start"
                        leftIcon={<AiOutlineSearch />}
                    >
                        Find a print
                    </Button>
                </VStack>

            </Flex>
        </>
    )
}