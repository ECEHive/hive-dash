import { useContext, useEffect, useMemo, useState } from 'react';

import {
    Badge,
    Button,
    Card,
    CardBody,
    CircularProgress,
    Code,
    Divider,
    HStack,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    List,
    ListItem,
    Spacer,
    Text,
    Tooltip,
    UnorderedList,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/usePrintParser';
import usePrintProgress from '@/hooks/usePrintProgress';
import useTextColor from '@/hooks/useTextColor';

import iconSet from '@/util/icons';
import { PrintStates, StateColors } from '@/util/states';

function PrintListItem({ data, isActive, onClick }) {
    const { betterPrintData, printerData } = usePrintParser(data);
    const { progressMessage, progress, timeLeft } = usePrintProgress(data);

    const progressTrackColor = useColorModeValue('gray.200', 'gray.500');
    const { secondary } = useTextColor();

    return (
        <Card
            w="100%"
            h="auto"
            as={Button}
            p={0}
            variant="filled"
            isActive={isActive}
            onClick={onClick}
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

                    <HStack
                        w="100%"
                        justifyContent="flex-start"
                        spacing={5}
                        color={secondary}
                    >
                        <HStack spacing={2}>
                            <Icon as={iconSet.printer} />
                            <Text fontWeight="normal">{printerData?.displayName}</Text>
                        </HStack>
                        <HStack spacing={2}>
                            <Icon as={iconSet.calendar} />
                            <Text fontWeight="normal">{betterPrintData.queuedAtFormatted}</Text>
                        </HStack>
                    </HStack>

                    {betterPrintData.state === PrintStates.PRINTING && (
                        <>
                            <Divider />

                            <HStack spacing={1.5}>
                                <CircularProgress
                                    value={progress}
                                    color="green.200"
                                    size={5}
                                    thickness={8}
                                    trackColor={progressTrackColor}
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
                                        {timeLeft}
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

export default function PrintList({ selectedPrintData, setSelectedPrintData }) {
    const { printers, printerTypes, queue } = useContext(PrintingContext);

    const [searchTerm, setSearchTerm] = useState('ch');

    const matchedPrints = useMemo(() => {
        if (searchTerm.length > 0) {
            return queue
                .filter(
                    (print) =>
                        print.endUser.email.toLowerCase().includes(searchTerm) ||
                        (print.endUser.firstname || '').toLowerCase().includes(searchTerm) ||
                        (print.endUser.lastname || '').toLowerCase().includes(searchTerm) ||
                        print.trayName.toLowerCase().includes(searchTerm) ||
                        dayjs(print.queuedAt).local().format('MM/DD/YYYY').includes(searchTerm)
                )
                .sort((a, b) => {
                    return dayjs.utc(b.queuedAt) - dayjs.utc(a.queuedAt);
                });
        } else {
            return [];
        }
    }, [queue, searchTerm]);

    return (
        <>
            <VStack
                w="400px"
                h="100%"
                spacing={3}
                alignItems="flex-start"
                justifyContent="flex-start"
            >
                <InputGroup w="100%">
                    <InputLeftElement>
                        <SearchIcon />
                    </InputLeftElement>
                    <Input
                        placeholder="Search for a print"
                        type="text"
                        //onBlur={search}
                        // value={searchEmail}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
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
                                        setSelectedPrintData(print);
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
                                    The date you queued it (in&nbsp;
                                    <Code>MM/DD/YYYY</Code>&nbsp;format)
                                </ListItem>
                            </UnorderedList>
                        </VStack>
                    )}
                </VStack>
            </VStack>
        </>
    );
}
