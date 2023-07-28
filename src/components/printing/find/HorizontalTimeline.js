import { useCallback, useEffect, useRef } from 'react';

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
    Spacer,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import { ArrowForwardIcon, ArrowRightIcon } from '@chakra-ui/icons';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';

import usePrintEvents from '@/hooks/usePrintEvents';
import useTextColor from '@/hooks/useTextColor';

function TimelineEvent({ event, isTopEnd, isBottomEnd }) {
    return (
        <>
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
        </>
    );
}

export default function Timeline({ print }) {
    const { detailedEvents, expectedEvents } = usePrintEvents(print);

    const lastElement = useRef(null);

    useEffect(() => {
        lastElement.current?.scrollIntoView({ behavior: 'smooth' });
    }, [detailedEvents]);

    const { secondary } = useTextColor();

    return (
        <>
            <Card
                w="100%"
                h="auto"
                variant="filled"
                border="1px"
                borderColor="chakra-border-color"
            >
                <CardBody
                    w="full"
                    p={0}
                >
                    <HStack
                        w="full"
                        h="100%"
                        spacing={2}
                        overflow="auto"
                        p={5}
                    >
                        {detailedEvents.reverse().map((event, i) => {
                            return (
                                <>
                                    <HStack>
                                        <TimelineEvent
                                            key={i}
                                            event={event}
                                            isTopEnd={i == 0}
                                            isBottomEnd={i == detailedEvents.length - 1}
                                        />
                                        {i !== detailedEvents.length - 1 ? (
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
                                                    color={secondary}
                                                >
                                                    {event.humanizedTimestamp}
                                                </Text>
                                            </VStack>
                                        )}
                                    </HStack>
                                </>
                            );
                        })}

                        {expectedEvents.length > 0 && (
                            <>
                                <Spacer minW="30px" />

                                <Text
                                    fontSize="md"
                                    color={secondary}
                                >
                                    Upcoming
                                </Text>
                                <ArrowForwardIcon fontSize="2xl" />

                                {expectedEvents.map((event, i) => {
                                    return (
                                        <>
                                            <HStack>
                                                <TimelineEvent
                                                    key={i}
                                                    event={event}
                                                    isFuture
                                                    //isTopEnd={i == 0}
                                                    //isBottomEnd={i == detailedEvents.length - 1}
                                                />
                                                {i !== expectedEvents.length - 1 && <ArrowForwardIcon fontSize="2xl" />}
                                            </HStack>
                                        </>
                                    );
                                })}
                            </>
                        )}
                    </HStack>
                </CardBody>
            </Card>
        </>
    );
}
