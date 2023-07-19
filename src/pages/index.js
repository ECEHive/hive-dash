import { Link } from '@chakra-ui/react';

import Head from 'next/head';
import NextLink from 'next/link';

export default function Home() {
    return (
        <>
            <Head>
                <title>hive</title>
            </Head>

            <Link as={NextLink} href={'/printing/dashboard'}>
                dashboard
            </Link>
        </>
    );
}
