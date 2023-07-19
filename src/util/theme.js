import { extendTheme } from '@chakra-ui/react';

const config = {
    initialColorMode: 'dark', // 'dark' | 'light'
    useSystemColorMode: false
};

const theme = extendTheme({
    config,
    fonts: {
        heading: `'Rubik', sans-serif`,
        body: `'Inter', sans-serif`
    },
    breakpoints: {
        sm: '320px',
        md: '768px',
        lg: '960px',
        xl: '1200px',
        '2xl': '1536px',
        '3xl': '2560px' // for extra big
    }
});

export default theme;
