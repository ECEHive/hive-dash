import { ChakraProvider } from '@chakra-ui/react';

import NextNProgress from 'nextjs-progressbar';

import { AuthProvider } from '@/contexts/AuthContext';
import { ConfirmDialogProvider } from '@/contexts/ConfirmDialogContext';

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
                <AuthProvider>
                    <ConfirmDialogProvider>{getLayout(<Component {...pageProps} />)}</ConfirmDialogProvider>
                </AuthProvider>
            </ChakraProvider>
        </>
    );
}

export default HiveDash;
