import { useMemo, useState } from 'react';

import {
    Badge,
    Box,
    Button,
    HStack,
    Heading,
    Icon,
    InputGroup,
    Progress,
    Spacer,
    Text,
    VStack
} from '@chakra-ui/react';

import { useRouter } from 'next/router';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';
import usePrinterParser from '@/hooks/printing/usePrinterParser';
import useFilters from '@/hooks/useFilters';

import iconSet from '@/util/icons';
import { StateColors } from '@/util/states';

import { AsyncSelect } from '@/components/Select';

function PrinterListItem({ data, onClick, isActive, queue }) {
    const { expandedPrinterData, currentPrintData, printerTypeData } = usePrinterParser(data);
    const { betterPrintData } = usePrintParser(currentPrintData);
    const { timeLeftHumanized, progress, progressCircleColor, progressBarColor } = usePrintProgress(currentPrintData);

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
                    borderBottom="1px solid"
                    borderColor="chakra-border-color"
                    onClick={onClick}
                    isActive={isActive}
                >
                    <VStack
                        w="full"
                        spacing={2}
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
                            <VStack
                                mt={2}
                                w="full"
                                align="start"
                            >
                                <Progress
                                    w="full"
                                    size="xs"
                                    colorScheme={progressBarColor}
                                    value={progress}
                                />

                                <VStack
                                    align="start"
                                    justify="start"
                                    spacing={1}
                                >
                                    <Text
                                        fontSize="md"
                                        fontWeight="medium"
                                    >
                                        {betterPrintData.trayName}
                                    </Text>
                                    <HStack
                                        color="secondaryText"
                                        fontSize="xs"
                                        spacing={1}
                                    >
                                        <Icon as={iconSet.clock} />
                                        <Text fontWeight="normal">{timeLeftHumanized}</Text>
                                    </HStack>
                                </VStack>
                            </VStack>
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

    const searchTypes = useMemo(
        () => [
            {
                label: 'Printer name',
                id: 'name',
                format: (printer) => {
                    return printer.displayName;
                },
                match: (printer, value) => {
                    return printer.displayName.toLowerCase().includes(value);
                }
            },
            {
                label: 'Printer type',
                id: 'type',
                format: (printer) => {
                    return printer.type;
                },
                match: (printer, value) => {
                    return printer.type.toLowerCase().includes(value);
                }
            }
        ],
        []
    );

    const [terms, setTerms, search, matches] = useFilters(searchTypes, printers, true);

    return (
        <>
            {/* <VStack w="auto" h="100%" justify="center">
                <IconButton icon={<ChevronRightIcon />} />
            </VStack> */}
            <VStack
                maxW="375px"
                w="full"
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
                    borderBottom="1px solid"
                    borderColor="chakra-border-color"
                >
                    <Icon as={iconSet.search} />
                    <InputGroup w="100%">
                        <AsyncSelect
                            variant="unstyled"
                            w="100%"
                            menuPlacement="auto"
                            isMulti
                            isClearable
                            placeholder={<Text>Search for a printer</Text>}
                            loadOptions={search}
                            onChange={(value) => {
                                if (value) {
                                    setTerms(value.map((term) => term.value));
                                } else {
                                    setTerms([]);
                                }
                            }}
                            value={
                                terms.length > 0
                                    ? terms.map((term) => ({
                                          label: `${term.split(':')[0]}: ${term.split(':')[1]}`,
                                          value: term
                                      }))
                                    : null
                            }
                            noOptionsMessage={(e) => {
                                return e.inputValue.length === 0 ? 'Start typing to search!' : 'No results';
                            }}
                        />
                    </InputGroup>
                </HStack>

                <VStack
                    w="100%"
                    alignItems="flex-start"
                    spacing={0}
                    overflow="auto"
                >
                    {matches.map((printer) => {
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
                </VStack>
            </VStack>
        </>
    );
}
