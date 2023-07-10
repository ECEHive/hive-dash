import { Button, Flex, VStack, useColorModeValue } from "@chakra-ui/react";
import { AiFillDashboard } from "react-icons/ai";

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
                    <Button 
                        variant="ghost" 
                        w="100%" 
                        justifyContent="flex-start"
                        isActive
                        leftIcon={<AiFillDashboard />}
                    >
                        Dashboard
                    </Button>
                </VStack>

            </Flex>
        </>
    )
}