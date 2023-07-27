import { Box, Flex, Icon, Spacer, Text } from '@chakra-ui/react';

import useTextColor from '@/hooks/useTextColor';

import iconSet from '@/util/icons';

export default function Footer() {
    const { secondary } = useTextColor();

    return (
        <Flex
            as="footer"
            position="fixed"
            bottom={0}
            h="1.5rem"
            w="100%"
            borderTop="1px"
            borderTopColor="chakra-border-color"
            dir="row"
            align="center"
            justify="end"
            px={4}
            fontSize="2xs"
            color={secondary}
        >
            <Text>
                <Icon as={iconSet.branch} /> {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev'} (
                {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || 'dev'})
            </Text>
            <Spacer />
            <Text>made with ❤️ by the HIVE peer instructors</Text>
        </Flex>
    );
}
