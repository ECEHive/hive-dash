import { ChakraProvider } from '@chakra-ui/react';

import NextNProgress from 'nextjs-progressbar';

import { AuthProvider } from '@/contexts/AuthContext';
import { ConfirmDialogProvider } from '@/contexts/ConfirmDialogContext';
import { NavProvider } from '@/contexts/NavContext';

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
                    showOnShallow={false}
                />
                <AuthProvider>
                    <NavProvider>
                        <ConfirmDialogProvider>{getLayout(<Component {...pageProps} />)}</ConfirmDialogProvider>
                    </NavProvider>
                </AuthProvider>
            </ChakraProvider>
        </>
    );
}

export default HiveDash;
