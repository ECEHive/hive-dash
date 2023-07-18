import { useColorModeValue } from '@chakra-ui/react';

function stateColorLookup(state) {
    switch (state) {
        case 'printing':
            return 'green'
        case 'idle':
            return 'yellow'
        case 'down':
            return 'red'
    }
}

export { stateColorLookup };
