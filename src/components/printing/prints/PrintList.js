import { useMemo } from 'react';

import {
    Badge,
    Box,
    Button,
    CircularProgress,
    Code,
    Divider,
    FormControl,
    HStack,
    Heading,
    Icon,
    InputGroup,
    ListItem,
    Spacer,
    Text,
    Tooltip,
    UnorderedList,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import { useRouter } from 'next/router';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';
import useFilters from '@/hooks/useFilters';

import iconSet from '@/util/icons';
import { PrintStates, StateColors } from '@/util/states';

import { AsyncSelect } from '@/components/Select';

function PrintListItem({ data, isActive, onClick }) {
    const { betterPrintData, printerData } = usePrintParser(data);
    const { progressMessage, progress, timeLeftHumanizedDetailed } = usePrintProgress(data);

    const progressColor = useColorModeValue('green.500', 'green.200');

    return (
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
                spacing={3}
                alignItems="flex-start"
                w="full"
                h="100%"
            >
                <HStack w="100%">
                    <Tooltip label={betterPrintData.trayName}>
                        <Heading
                            size="md"
                            fontWeight="medium"
                            fontFamily="body"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                        >
                            {betterPrintData.trayName}
                        </Heading>
                    </Tooltip>
                    <Spacer />
                    <Badge
                        variant="subtle"
                        colorScheme={StateColors[betterPrintData.state]}
                    >
                        {betterPrintData.stateName}
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
                    <HStack
                        spacing={2}
                        align="center"
                    >
                        <Icon as={iconSet.printer} />
                        <Text fontWeight="normal">{printerData?.displayName}</Text>
                    </HStack>
                    <HStack
                        spacing={2}
                        align="center"
                    >
                        <Icon as={iconSet.refresh} />
                        <Text fontWeight="normal">{betterPrintData.updatedAtHumanized}</Text>
                    </HStack>
                </VStack>

                {betterPrintData.state === PrintStates.PRINTING && (
                    <>
                        <Divider />

                        <HStack spacing={1.5}>
                            <CircularProgress
                                value={progress}
                                color={progressColor}
                                size={5}
                                thickness={8}
                                trackColor="progressTrack"
                            />
                            <VStack
                                align="start"
                                justify="start"
                                spacing={1}
                            >
                                <Text
                                    fontSize="lg"
                                    fontWeight="medium"
                                    lineHeight={1}
                                >
                                    {timeLeftHumanizedDetailed}
                                </Text>
                            </VStack>
                        </HStack>
                    </>
                )}
            </VStack>
        </Box>
    );
}

export default function PrintList({ selectedPrintData, setSelectedPrintId }) {
    const { printers, printerTypes, queue } = usePrinting();
    const { push } = useRouter();

    const searchTypes = useMemo(
        () => [
            {
                label: 'Email',
                id: 'email',
                format: (print) => {
                    return print.endUser.email;
                },
                match: (print, value) => {
                    return print.endUser.email.toLowerCase().includes(value);
                }
            },
            {
                label: 'Tray name',
                id: 'tray',
                format: (print) => {
                    return print.trayName;
                },
                match: (print, value) => {
                    return print.trayName.toLowerCase().includes(value);
                }
            },
            {
                label: 'Date',
                id: 'date',
                format: (print) => {
                    return dayjs(print.queuedAt).local().format('MM/DD/YYYY');
                },
                match: (print, value) => {
                    return dayjs(print.queuedAt).local().format('MM/DD/YYYY').includes(value);
                }
            }
        ],
        []
    );

    const [terms, setTerms, search, matches] = useFilters(searchTypes, queue);

    return (
        <>
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
                    p={3}
                    borderBottom="1px solid"
                    borderColor="chakra-border-color"
                >
                    <Icon as={iconSet.search} />
                    <FormControl>
                        <InputGroup w="100%">
                            <AsyncSelect
                                variant="unstyled"
                                w="100%"
                                isMulti
                                isClearable
                                placeholder={<Text>Search for a print</Text>}
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
                    </FormControl>
                </HStack>

                <VStack
                    w="full"
                    h="auto"
                    alignItems="flex-start"
                    spacing={0}
                    overflow="auto"
                >
                    {matches.length > 0 ? (
                        matches.map((print) => {
                            return (
                                <PrintListItem
                                    key={print._id}
                                    data={print}
                                    onClick={() => {
                                        push(`/printing/prints/${print._id}`, undefined, { shallow: true });
                                    }}
                                    isActive={selectedPrintData?._id === print._id}
                                />
                            );
                        })
                    ) : (
                        <VStack
                            align="start"
                            px={5}
                            pt={5}
                        >
                            <Text fontSize="lg">Search for a print using any of the following fields:</Text>
                            <UnorderedList>
                                <ListItem>Your @gatech.edu email</ListItem>
                                <ListItem>The print&apos;s name</ListItem>
                                <ListItem>
                                    The print&apos;s queue date in <Code>MM/DD/YYYY</Code> format
                                </ListItem>
                            </UnorderedList>
                        </VStack>
                    )}
                </VStack>
            </VStack>
        </>
    );
}
