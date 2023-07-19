import { useCallback, useContext, useState } from 'react';

import {
    Badge,
    Button,
    Card,
    CardBody,
    CircularProgress,
    HStack,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    Spacer,
    Text,
    VStack
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

import PrintingContext from '@/contexts/printing/PrintingContext';

import PrinterListItem from './PrinterListItem';

export default function PrinterList({ selectedPrinter, setSelectedPrinter }) {
    const { printers, printerTypes, queue } = useContext(PrintingContext);

    //const [searchTerm, setSearchTerm] = useState('');
    const [matchedPrinters, setMatchedPrinters] = useState(printers);

    const search = useCallback(
        (searchTerm) => {
            if (searchTerm.length > 0) {
                setMatchedPrinters(
                    printers.filter((printer) =>
                        printer.displayName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                    )
                );
            } else {
                setMatchedPrinters(printers);
            }
        },
        [printers]
    );

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
                    <Input
                        placeholder="Search for a printer"
                        type="text"
                        //value={searchTerm}
                        onChange={(e) => {
                            search(e.target.value);
                        }}
                        // onKeyDown={(e) => {
                        //     if (e.key === 'Enter') search();
                        // }}
                    />
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

                                {matchedPrinters
                                    .filter(
                                        (printer) => printer.type === type.id
                                    )
                                    .map((printer) => {
                                        return (
                                            <PrinterListItem
                                                key={printer._id}
                                                data={printer}
                                                queue={queue}
                                                onClick={() => {
                                                    setSelectedPrinter(printer);
                                                }}
                                                isActive={
                                                    printer.id ===
                                                    selectedPrinter?.id
                                                }
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
