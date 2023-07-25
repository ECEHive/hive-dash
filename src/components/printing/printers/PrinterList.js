import { useContext, useMemo, useState } from 'react';

import {
    Badge,
    Button,
    Card,
    CardBody,
    CircularProgress,
    HStack,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Spacer,
    Text,
    VStack,
    VisuallyHidden
} from '@chakra-ui/react';

import { ChevronRightIcon, SearchIcon } from '@chakra-ui/icons';

import PrintingContext from '@/contexts/printing/PrintingContext';

import PrinterListItem from './PrinterListItem';

export default function PrinterList({ selectedPrinter, setSelectedPrinter }) {
    const { printers, printerTypes, queue } = useContext(PrintingContext);

    const [searchTerm, setSearchTerm] = useState('');

    const matchedPrinters = useMemo(() => {
        if (searchTerm.length > 0) {
            return printers.filter(
                (printer) =>
                    printer.displayName.includes(searchTerm.toLowerCase()) ||
                    printerTypes
                        .find((type) => type.id === printer.type)
                        .displayName.toLowerCase()
                        .includes(searchTerm)
            );
        } else {
            return printers;
        }
    }, [printers, printerTypes, searchTerm]);

    return (
        <>
            {/* <VStack w="auto" h="100%" justify="center">
                <IconButton icon={<ChevronRightIcon />} />
            </VStack> */}
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
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value.toLowerCase());
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
                                <Text
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    my={1}
                                >
                                    {type.displayName}
                                </Text>

                                {matchedPrinters
                                    .filter((printer) => printer.type === type.id)
                                    .map((printer) => {
                                        return (
                                            <PrinterListItem
                                                key={printer._id}
                                                data={printer}
                                                queue={queue}
                                                onClick={() => {
                                                    setSelectedPrinter(printer);
                                                }}
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
