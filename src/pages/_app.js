import { useEffect, useState } from 'react';

import { Box, ChakraProvider, ColorModeScript, useColorModeValue } from '@chakra-ui/react';

import NextNProgress from 'nextjs-progressbar';

import '@/util/global.css';
import theme from '@/util/theme';

function HiveDash({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => page);

    return (
        <>
            <ChakraProvider theme={theme}>
                <NextNProgress
                    color={'#FFE500'}
                    startPosition={0}
                    //stopDelayMs={250}
                    height={2}
                    options={{
                        showSpinner: false
                    }}
                />
                {getLayout(<Component {...pageProps} />)}
            </ChakraProvider>
        </>
    );
}

export default HiveDash;
