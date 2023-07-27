import { useContext, useMemo, useState } from 'react';

import {
    Badge,
    Button,
    Card,
    CardBody,
    CircularProgress,
    Divider,
    HStack,
    Heading,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Spacer,
    Text,
    VStack,
    VisuallyHidden,
    useColorModeValue
} from '@chakra-ui/react';

import { ChevronRightIcon, SearchIcon } from '@chakra-ui/icons';

import PrintingContext from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/usePrintParser';
import usePrintProgress from '@/hooks/usePrintProgress';
import usePrinterParser from '@/hooks/usePrinterParser';
import useTextColor from '@/hooks/useTextColor';

import iconSet from '@/util/icons';
import { StateColors } from '@/util/states';

function PrinterListItem({ data, onClick, isActive, queue }) {
    const { expandedPrinterData, currentPrintData, printerTypeData } = usePrinterParser(data);
    const { betterPrintData } = usePrintParser(currentPrintData);
    const { timeLeftHumanized, progress } = usePrintProgress(currentPrintData);

    const progressTrackColor = useColorModeValue('gray.200', 'gray.500');
    const cardColor = useColorModeValue('white.100', 'gray.700');

    const { secondary } = useTextColor();

    return (
        <>
            {expandedPrinterData && (
                <Card
                    w="100%"
                    //minH="115px"
                    h="auto"
                    as={Button}
                    p={0}
                    variant="filled"
                    onClick={onClick}
                    isActive={isActive}
                    bgColor={cardColor}
                >
                    <CardBody w="100%">
                        <VStack
                            spacing={3}
                            alignItems="flex-start"
                            h="100%"
                        >
                            <HStack w="100%">
                                <Heading
                                    size="md"
                                    fontWeight="medium"
                                    fontFamily="body"
                                >
                                    {data.displayName}
                                </Heading>
                                <Spacer />
                                <Badge
                                    variant="subtle"
                                    colorScheme={StateColors[expandedPrinterData.state]}
                                >
                                    {expandedPrinterData.state}
                                </Badge>
                            </HStack>

                            <HStack
                                w="100%"
                                justifyContent="flex-start"
                                spacing={5}
                                color={secondary}
                            >
                                {/* <HStack spacing={2}>
                                    <BsPrinterFill size={15} />
                                    <Text fontWeight="normal">
                                        {printerTypeData?.displayName}
                                    </Text>
                                </HStack> */}
                                <HStack spacing={2}>
                                    <Icon as={iconSet.queue} />
                                    <Text fontWeight="normal">{expandedPrinterData?.queueLength} in queue</Text>
                                </HStack>
                            </HStack>

                            {expandedPrinterData.state === 'printing' && (
                                <>
                                    <Divider />

                                    <HStack spacing={1.5}>
                                        <CircularProgress
                                            value={progress}
                                            color="green.200"
                                            size={7}
                                            thickness={8}
                                            trackColor={progressTrackColor}
                                        />
                                        <VStack
                                            align="start"
                                            justify="start"
                                            spacing={1}
                                        >
                                            <Text
                                                fontSize="md"
                                                fontWeight="medium"
                                                lineHeight={1}
                                            >
                                                {betterPrintData.trayName}
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                fontWeight="normal"
                                                color="gray.400"
                                                lineHeight={1}
                                            >
                                                {timeLeftHumanized}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </>
                            )}
                        </VStack>
                    </CardBody>
                </Card>
            )}
        </>
    );
}

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
                    pr={1}
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
