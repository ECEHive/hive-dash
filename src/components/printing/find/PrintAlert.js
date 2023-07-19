import usePrintParser from '@/hooks/usePrintParser';
import {
    Alert,
    AlertIcon,
    AlertDescription,
    useColorModeValue,
    Box,
    Text
} from '@chakra-ui/react';

export default function PrintAlert({ print }) {
    const { printerData } = usePrintParser(print);

    return (
        <>
            {printerData.type === 'stratasys' && (
                <Box w="100%" h="auto">
                    <Alert status="warning" borderRadius={5}>
                        <AlertIcon />
                        <AlertDescription>
                            This print uses QSR supports, which we will remove
                            for you. Expect it to be ready one business day later than the
                            print completion date.
                        </AlertDescription>
                    </Alert>
                </Box>
            )}
        </>
    );
}
