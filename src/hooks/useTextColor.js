import { useColorModeValue } from '@chakra-ui/react';

export default function useTextColor() {
    const primary = useColorModeValue('black', 'white');
    const secondary = useColorModeValue('gray.500', 'gray.300');

    return { primary, secondary };
}
