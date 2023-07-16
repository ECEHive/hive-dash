import {
    VStack,
    HStack,
    Heading,
    
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import PrinterType from '@/components/printing/new/PrinterType';
import PrinterItem from '@/components/printing/new/PrinterItem';

export default function PrinterSelect(props) {
    return (
        <>
            <Heading size="lg" fontFamily="body">
                Select a printer type
            </Heading>

            <HStack
                w="100%"
                h="auto"
                spacing={3}
                justify="start"
                overflow="auto"
            >
                <VStack
                    spacing={3}
                    w="auto"
                    h="100%"
                    justify="flex-start"
                    overflow="auto"
                >
                    <PrinterType type="Ultimaker" />
                    <PrinterType type="Stratasys" />
                    <PrinterType type="Formlabs" />
                    <PrinterType type="Markforged" />
                </VStack>

                <ChevronRightIcon boxSize={10} />

                <VStack
                    spacing={3}
                    w="auto"
                    h="100%"
                    justify="flex-start"
                    overflow="auto"
                >
                    <PrinterItem />
                </VStack>
            </HStack>
        </>
    );
}
