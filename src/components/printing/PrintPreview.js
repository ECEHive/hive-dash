import { useContext } from 'react';
import {
    Badge,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    HStack,
    Progress,
    Spacer,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/PrintingContext';
import usePrintProgress from '@/hooks/usePrintProgress';

export default function PrintPreview({ actions, print }) {
    const { printerTypes, printers } = useContext(PrintingContext);

    const [progress, timeLeft] = usePrintProgress(print);

    return (
        <Card
            w="100%"
            h="auto"
            variant="filled"
            bgColor={useColorModeValue('gray.200', 'gray.600')}
        >
            <CardBody>
                <HStack w="100%" spacing={5}>
                    <VStack w="100%" spacing={4}>
                        <VStack w="100%" spacing={1}>
                            <HStack w="100%">
                                <VStack
                                    alignItems="flex-start"
                                    h="100%"
                                    w="100%"
                                    spacing={0}
                                >
                                    <Text fontSize="lg" fontWeight="medium">
                                        {print.trayName}
                                    </Text>
                                    <Text fontSize="sm">
                                        Queued by: {print.queuedBy}
                                    </Text>
                                </VStack>
                                <Spacer />
                                <Badge variant="subtle" alignSelf="flex-end">
                                    est. {timeLeft}
                                </Badge>
                            </HStack>
                            <Progress
                                w="100%"
                                value={progress}
                                size="sm"
                                borderRadius={5}
                                colorScheme="blue"
                            />
                        </VStack>

                        <HStack
                            justifyContent="flex-start"
                            alignItems="flex-end"
                            w="100%"
                            spacing={6}
                        >
                            <VStack alignItems="flex-start" spacing={0}>
                                <Text
                                    fontSize="3xl"
                                    fontWeight="semibold"
                                    lineHeight={1}
                                >
                                    {dayjs
                                        .duration(print.estTime)
                                        .format('HH:mm')}
                                </Text>
                                <Text fontSize="md" fontWeight="normal">
                                    est. print time
                                </Text>
                            </VStack>
                            <VStack alignItems="flex-start" spacing={0}>
                                <HStack spacing={1}>
                                    <Text
                                        fontSize="3xl"
                                        fontWeight="semibold"
                                        lineHeight={1}
                                    >
                                        {print.materialUsage}
                                    </Text>
                                    <Text fontSize="sm" alignSelf="flex-end">
                                        {
                                            printerTypes.find(
                                                (type) =>
                                                    type.id ===
                                                    printers.find(
                                                        (p) =>
                                                            p.id ===
                                                            print.printer
                                                    ).type
                                            ).materialUnits.symbol
                                        }
                                    </Text>
                                </HStack>
                                <Text fontSize="md" fontWeight="normal">
                                    est. material
                                </Text>
                            </VStack>
                            <VStack alignItems="flex-start" spacing={0}>
                                <Text
                                    fontSize="3xl"
                                    fontWeight="semibold"
                                    lineHeight={1}
                                >
                                    {print.materialType}
                                </Text>
                                <Text fontSize="md" fontWeight="normal">
                                    material type
                                </Text>
                            </VStack>

                            <Spacer />

                            {actions}
                        </HStack>
                    </VStack>
                </HStack>
            </CardBody>
        </Card>
    );
}
