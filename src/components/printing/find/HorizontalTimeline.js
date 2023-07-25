import { useCallback, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

import {
    Box,
    Card,
    CardBody,
    HStack,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Text,
    VStack
} from '@chakra-ui/react';

import { ArrowForwardIcon, ArrowRightIcon } from '@chakra-ui/icons';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

import usePrintParser from '@/hooks/usePrintParser';

function TimelineEvent({ event, isTopEnd, isBottomEnd }) {
    return (
        <>
            {/* <HStack spacing={0}> */}
            {/* <VStack
                w="100%"
                h="auto"
            >
                <HStack w="100%"> */}
            {/* <Box
                        w="50%"
                        h="2px"
                        bgColor="gray.400"
                        borderRightRadius={10}
                        visibility={isTopEnd ? 'hidden' : 'visible'}
                    /> */}
            <Popover preventOverflow>
                <PopoverTrigger>
                    <Box cursor="pointer">{event.icon}</Box>
                </PopoverTrigger>
                <Portal>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>
                            {event.description} @ {event.formattedTimestamp}
                        </PopoverHeader>
                        {event?.notes?.length > 0 && (
                            <PopoverBody
                                maxH="200px"
                                overflow="auto"
                            >
                                <ReactMarkdown
                                    skipHtml
                                    components={ChakraUIRenderer()}
                                >
                                    {event?.notes}
                                </ReactMarkdown>
                            </PopoverBody>
                        )}
                    </PopoverContent>
                </Portal>
            </Popover>

            {/* <Box
                        w="50%"
                        h="2px"
                        bgColor="gray.400"
                        borderLeftRadius={10}
                        visibility={isBottomEnd ? 'hidden' : 'visible'}
                    /> */}
            {/* </HStack>
            </VStack> */}
            {/* </HStack> */}
        </>
    );
}

export default function Timeline({ print }) {
    const { expandedPrintData } = usePrintParser(print);

    const lastElement = useRef(null);

    useEffect(() => {
        lastElement.current?.scrollIntoView({ behavior: 'smooth' });
    }, [expandedPrintData]);

    return (
        <>
            <Card
                w="100%"
                h="auto"
                variant="filled"
            >
                <CardBody
                    w="full"
                    overflow="auto"
                >
                    <HStack
                        w="min-content"
                        h="100%"
                        spacing={2}
                    >
                        {expandedPrintData.detailedEvents.reverse().map((event, i) => {
                            return (
                                <>
                                    <HStack>
                                        <TimelineEvent
                                            key={i}
                                            event={event}
                                            isTopEnd={i == 0}
                                            isBottomEnd={i == expandedPrintData.events.length - 1}
                                        />
                                        {i !== expandedPrintData.events.length - 1 ? (
                                            <ArrowForwardIcon fontSize="2xl" />
                                        ) : (
                                            <VStack
                                                spacing={0.5}
                                                align="start"
                                            >
                                                <Text
                                                    fontSize="xl"
                                                    fontWeight="medium"
                                                    whiteSpace="nowrap"
                                                    lineHeight={1}
                                                    ref={lastElement}
                                                >
                                                    {event.description}
                                                </Text>
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.400"
                                                >
                                                    {event.formattedTimestamp}
                                                </Text>
                                            </VStack>
                                        )}
                                    </HStack>
                                </>
                            );
                        })}
                        {/* <Box
                            ref={lastElement}
                            minW="40%"
                            h="100%"
                        /> */}
                    </HStack>
                </CardBody>
            </Card>
        </>
    );
}
