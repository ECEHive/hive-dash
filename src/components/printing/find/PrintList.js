import { useMemo, useState } from 'react';

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

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';

import iconSet from '@/util/icons';
import { PrintStates, StateColors } from '@/util/states';

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
                w="375px"
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
                                        setSelectedPrintId(print._id);
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
