import { VStack } from '@chakra-ui/react';

import usePrintParser from '@/hooks/usePrintParser';

import TimelineEvent from './TimelineEvent';

export default function Timeline({ print }) {
    const { expandedPrintData } = usePrintParser(print);

    return (
        <>
            {/* <Card
                                w="auto"
                                h="auto"
                                variant="filled"
                                bgColor={useColorModeValue(
                                    'gray.200',
                                    'gray.600'
                                )}
                            >
                                <CardBody w="100%" h="100%"> */}
            <VStack w="100%" h="100%" spacing={0} overflow="auto">
                {expandedPrintData.detailedEvents.map((event, i) => {
                    return (
                        <TimelineEvent
                            key={i}
                            event={event}
                            topEnd={i == 0}
                            bottomEnd={i == expandedPrintData.events.length - 1}
                        />
                    );
                })}
            </VStack>
            {/* </CardBody>
                            </Card> */}
        </>
    );
}
