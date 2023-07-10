import { extendTheme } from "@chakra-ui/react";

const config = {
    initialColorMode: 'dark', // 'dark' | 'light'
    useSystemColorMode: false,
}

const theme = extendTheme({
    config,
    fonts: {
        heading: `'Rubik', sans-serif`,
        body: `'Inter', sans-serif`
    },
});

export default theme;