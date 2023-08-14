import { Modal, extendTheme } from '@chakra-ui/react';

const config = {
    initialColorMode: 'dark', // 'dark' | 'light'
    useSystemColorMode: false
};

Modal.defaultProps = {
    motionPreset: 'slideInBottom',
    bgColor: 'gray.900'
};

const theme = extendTheme({
    config,
    semanticTokens: {
        colors: {
            secondaryText: {
                default: 'gray.500',
                _dark: 'gray.400'
            },
            secondaryTextAlt: {
                default: 'gray.600',
                _dark: 'gray.300'
            },
            progressTrack: {
                default: 'gray.300',
                _dark: 'gray.500'
            },
            progressTrackAlt: {
                default: 'gray.100',
                _dark: 'gray.700'
            }
        }
    },
    fonts: {
        heading: `'Inter', sans-serif`,
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
