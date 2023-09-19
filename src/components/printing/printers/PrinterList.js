import { useMemo, useState } from 'react';

import {
    Badge,
    Box,
    Button,
    CircularProgress,
    Divider,
    HStack,
    Heading,
    Icon,
    Input,
    InputGroup,
    Spacer,
    Text,
    VStack
} from '@chakra-ui/react';

import { useRouter } from 'next/router';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';
import usePrinterParser from '@/hooks/printing/usePrinterParser';

import iconSet from '@/util/icons';
import { StateColors } from '@/util/states';

function PrinterListItem({ data, onClick, isActive, queue }) {
    const { expandedPrinterData, currentPrintData, printerTypeData } = usePrinterParser(data);
    const { betterPrintData } = usePrintParser(currentPrintData);
    const { timeLeftHumanized, progress, progressCircleColor } = usePrintProgress(currentPrintData);

    //const cardColor = useColorModeValue('white.100', 'gray.700');

    return (
        <>
            {expandedPrinterData && (
                <Box
                    w="full"
                    h="auto"
                    as={Button}
                    borderRadius={0}
                    p={5}
                    borderTop="1px solid"
                    borderColor="chakra-border-color"
                    onClick={onClick}
                    isActive={isActive}
                >
                    <VStack
                        w="full"
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

                        <VStack
                            w="100%"
                            justify="start"
                            align="start"
                            spacing={2}
                            color="secondaryText"
                            fontSize="sm"
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
                            {/* <HStack
                                    spacing={2}
                                    align="center"
                                >
                                    <Icon as={iconSet.refresh} />
                                    <Text fontWeight="normal">{expandedPrinterData.updatedAtHumanized}</Text>
                                </HStack> */}
                        </VStack>

                        {expandedPrinterData.state === 'printing' && (
                            <>
                                <Divider />

                                <HStack spacing={1.5}>
                                    <CircularProgress
                                        value={progress}
                                        color={progressCircleColor}
                                        size={8}
                                        thickness={8}
                                        trackColor="progressTrack"
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
                                            color="secondaryText"
                                            lineHeight={1}
                                        >
                                            {timeLeftHumanized}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </>
                        )}
                    </VStack>
                </Box>
            )}
        </>
    );
}

export default function PrinterList({ selectedPrinter }) {
    const { push } = useRouter();
    const { printers, printerTypes, queue } = usePrinting();

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
                minW="375px"
                h="100%"
                spacing={0}
                alignItems="flex-start"
                justifyContent="flex-start"
                borderRight="1px solid"
                borderColor="chakra-border-color"
            >
                <HStack
                    w="full"
                    h="auto"
                    p={5}
                >
                    <Icon as={iconSet.search} />
                    <InputGroup>
                        <Input
                            h="auto"
                            w="full"
                            size="lg"
                            variant="unstyled"
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
                </HStack>

                <VStack
                    w="100%"
                    alignItems="flex-start"
                    spacing={0}
                    overflow="auto"
                >
                    {printerTypes.map((type) => {
                        return (
                            <>
                                {/* <Text
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    my={1}
                                >
                                    {type.displayName}
                                </Text> */}

                                {matchedPrinters
                                    .filter((printer) => printer.type === type.id)
                                    .map((printer) => {
                                        return (
                                            <PrinterListItem
                                                key={printer._id}
                                                data={printer}
                                                queue={queue}
                                                onClick={() => {
                                                    push('/printing/printers/' + printer.id, undefined, {
                                                        shallow: true
                                                    });
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
