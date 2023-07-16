import { ChakraProvider, ColorModeScript, useColorModeValue } from '@chakra-ui/react';
import NextNProgress from 'nextjs-progressbar';

import theme from '@/util/theme';

function MyApp({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => page);

    return (
        <>
            <ChakraProvider theme={theme}>
                <NextNProgress
                    color={'#FFE500'}
                    startPosition={0}
                    //stopDelayMs={250}
                    height={1.5}
                    options={{
                        showSpinner: false,
                    }}
                />
                {getLayout(<Component {...pageProps} />)}
            </ChakraProvider>
        </>
    );
}

export default MyApp;
