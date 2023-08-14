import { useCallback, useMemo, useState } from 'react';

import {
    Badge,
    Button,
    Card,
    CardBody,
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
    chakra,
    useColorModeValue
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

import { AsyncSelect } from 'chakra-react-select';
import { useRouter } from 'next/router';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';

import iconSet from '@/util/icons';
import { PrintStates, StateColors } from '@/util/states';

const ChakraAsyncSelect = chakra(AsyncSelect);

function PrintListItem({ data, isActive, onClick }) {
    const { betterPrintData, printerData } = usePrintParser(data);
    const { progressMessage, progress, timeLeftHumanizedDetailed } = usePrintProgress(data);

    const progressColor = useColorModeValue('green.500', 'green.200');

    return (
        <Card
            w="100%"
            h="auto"
            as={Button}
            p={0}
            variant="outline"
            isActive={isActive}
            onClick={onClick}
            bgColor="chakra-subtle-bg"
        >
            <CardBody w="100%">
                <VStack
                    spacing={3}
                    alignItems="flex-start"
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
            </CardBody>
        </Card>
    );
}

export default function PrintList({ selectedPrintData, setSelectedPrintId }) {
    const { printers, printerTypes, queue } = usePrinting();
    const { push } = useRouter();

    const [searchTerms, setSearchTerms] = useState([]);

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

    const matchedPrints = useMemo(() => {
        if (searchTerms.length < 1) {
            return [];
        }
        let matches = queue.filter((print) => {
            let match = true;
            searchTerms.forEach((term) => {
                const type = searchTypes.find((type) => type.id === term.split(':')[0]);
                const value = term.split(':')[1].toLowerCase();

                let result = type.match(print, value);

                if (!result) {
                    match = false;
                }
            });
            return match;
        });

        matches = matches.sort((a, b) => {
            let aTime = dayjs(a.updatedAt).valueOf();
            let bTime = dayjs(b.updatedAt).valueOf();
            console.log(aTime, bTime);
            if (aTime > bTime) {
                return -1;
            }
            if (aTime < bTime) {
                return 1;
            }
            return 0;
        });

        return matches;
    }, [searchTerms, queue, searchTypes]);

    const search = useCallback(
        (inputValue, callback) => {
            if (inputValue.length < 1) {
                return callback([]);
            }

            let currentResults;
            if (matchedPrints.length > 0) {
                currentResults = [...matchedPrints];
            } else {
                currentResults = [...queue];
            }

            let newResults = [];

            for (const type of searchTypes) {
                let targets = currentResults.map((print) => type.format(print));
                let results = targets.filter((thing) => thing.toLowerCase().includes(inputValue.toLowerCase()));
                results = [...new Set(results)]; //removes duplicates
                newResults.push({
                    label: type.label,
                    options: results.map((item) => ({
                        label: item,
                        value: `${type.id}:${item}`
                    }))
                });
            }

            return callback(newResults);
        },
        [queue, matchedPrints, searchTypes]
    );

    return (
        <>
            <VStack
                w="375px"
                h="100%"
                spacing={3}
                alignItems="flex-start"
                justifyContent="flex-start"
            >
                <FormControl>
                    <InputGroup w="100%">
                        <ChakraAsyncSelect
                            w="100%"
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999
                                })
                            }}
                            menuPlacement="auto"
                            isMulti
                            isClearable
                            placeholder={
                                <HStack spacing={2}>
                                    <SearchIcon />
                                    <Text>Search for a print</Text>
                                </HStack>
                            }
                            loadOptions={search}
                            onChange={(value) => {
                                if (value) {
                                    setSearchTerms(value.map((term) => term.value));
                                } else {
                                    setSearchTerms([]);
                                }
                            }}
                            value={
                                searchTerms.length > 0
                                    ? searchTerms.map((term) => ({
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

                <VStack
                    w="100%"
                    alignItems="flex-start"
                    spacing={3}
                    overflow="auto"
                    pt={3}
                    pr={1}
                >
                    {matchedPrints.length > 0 ? (
                        matchedPrints.map((print) => {
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
                            px={3}
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
