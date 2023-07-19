import { useContext } from 'react';
import {
    VStack,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    Heading,
    Badge,
    HStack,
    Spacer,
    Button,
    CircularProgress,
    Card,
    CardBody
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import PrinterListItem from './PrinterListItem';

import PrintingContext from '@/contexts/printing/PrintingContext';

export default function PrinterList({ selectedPrinter, setSelectedPrinter }) {
    const { printers, printerTypes, queue } = useContext(PrintingContext);

    return (
        <>
            <VStack
                w="400px"
                h="100%"
                spacing={3}
                alignItems="flex-start"
                justifyContent="flex-start"
            >
                <InputGroup>
                    <InputLeftElement>
                        <SearchIcon />
                    </InputLeftElement>
                    <Input placeholder="Search for a printer" />
                </InputGroup>

                <VStack
                    w="100%"
                    alignItems="flex-start"
                    spacing={3}
                    overflow="auto"
                >
                    {printerTypes.map((type) => {
                        return (
                            <>
                                <Text fontSize="xl" fontWeight="bold" my={1}>
                                    {type.displayName}
                                </Text>

                                {printers
                                    .filter((printer) => printer.type === type.id)
                                    .map((printer) => {
                                        return (
                                            <PrinterListItem
                                                key={printer._id}
                                                data={printer}
                                                queue={queue}
                                                onClick={() => {setSelectedPrinter(printer)}}
                                                isActive={printer.id === selectedPrinter?.id}
                                            />
                                        );
                                    })}
                            </>
                        );
                    })}
                </VStack>
            </VStack>
        </>
    );
}
