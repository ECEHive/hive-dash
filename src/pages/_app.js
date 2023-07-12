import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import theme from '@/util/theme';

function MyApp({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => page);

    return (
        <>
            <ChakraProvider theme={theme}>
                {getLayout(<Component {...pageProps} />)}
            </ChakraProvider>
        </>
    );
}

export default MyApp;
