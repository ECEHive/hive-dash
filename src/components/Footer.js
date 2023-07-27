import { Box, Flex, Text } from '@chakra-ui/react';

export default function Footer() {
    return (
        <Flex
            as="footer"
            position="fixed"
            bottom={0}
            h="2rem"
            w="100%"
            borderTop="1px"
            borderTopColor="chakra-border-color"
            dir="row"
            align="center"
            justify="end"
            px={4}
        >
            <Text fontSize="xs">made with ❤️ by the HIVE peer instructors</Text>
        </Flex>
    );
}
