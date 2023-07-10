import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

import theme from "@/util/theme"

import {
    Inter
} from "next/font/google";
const font = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => page);

    return (
        <>
            <ChakraProvider theme={theme}>
                <div className={font.className} style={{}}>
                    {getLayout(<Component {...pageProps} />)}
                </div>
            </ChakraProvider>
        </>
    )
}

export default MyApp;