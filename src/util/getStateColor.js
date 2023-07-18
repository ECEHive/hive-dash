import { useColorModeValue } from '@chakra-ui/react';

export default function getStateColor(state) {
    switch (state) {
        case 'printing':
            return 'green';
        case 'idle':
            return 'yellow';
        case 'down':
            return 'red';
        case 'queued':
            return 'orange';
        case 'failed':
            return 'red';
    }
}
