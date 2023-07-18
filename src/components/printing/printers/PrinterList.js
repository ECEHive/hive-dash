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

import PrintingContext from '@/contexts/PrintingContext';

export default function PrinterList({ selectedPrinterId, setselectedPrinterId }) {
    const { printers, printerTypes } = useContext(PrintingContext);

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
                        console.log(type)
                        return (
                            <>
                                <Text fontSize="xl" fontWeight="bold" my={1}>
                                    {type.displayName}
                                </Text>

                                {printers
                                    .filter((printer) => printer.type === type.id)
                                    .map((printer) => {
                                        console.log(printer)
                                        return (
                                            <PrinterListItem
                                                key={printer._id}
                                                data={printer}
                                                onClick={() => {setselectedPrinterId(printer.id)}}
                                                isActive={printer.id === selectedPrinterId}
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
