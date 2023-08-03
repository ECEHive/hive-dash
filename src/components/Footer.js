import { useMemo } from 'react';

import { Flex, Icon, Link, Spacer, Text } from '@chakra-ui/react';

import iconSet from '@/util/icons';

export default function Footer() {
    const isDev = useMemo(() => {
        return process.env.NODE_ENV === 'development';
    }, []);

    return (
        <Flex
            as="footer"
            h="full"
            w="100%"
            borderTop="1px"
            borderTopColor="chakra-border-color"
            dir="row"
            align="center"
            justify="end"
            px={4}
            fontSize="2xs"
            color="secondaryText"
        >
            <Link
                href={
                    isDev
                        ? 'https://github.com/colinhartigan/hive-dash'
                        : `https://github.com/colinhartigan/hive-dash/tree/${process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA}`
                }
                target="_blank"
            >
                <Icon as={iconSet.branch} /> {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev'} (
                {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || 'dev'})
            </Link>
            <Spacer />
            <Text>made with ❤️ by the HIVE peer instructors</Text>
        </Flex>
    );
}
