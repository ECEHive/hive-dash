import {
    Badge,
    Box,
    Card,
    CardBody,
    CircularProgress,
    CircularProgressLabel,
    Divider,
    HStack,
    Icon,
    Progress,
    Spacer,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import usePrintParser from '@/hooks/usePrintParser';
import usePrintProgress from '@/hooks/usePrintProgress';

import iconSet from '@/util/icons';

export default function PrintPreview({ actions, print }) {
    const { betterPrintData } = usePrintParser(print);
    const { progressBarColor, progressMessage, progress } = usePrintProgress(print);

    return (
        // <Card
        //     w="100%"
        //     h="auto"
        //     variant="filled"
        //     background="transparent"
        //     border="none"
        //     //bgColor={useColorModeValue('gray.200', 'gray.600')}
        // >
        //     <CardBody>
        <VStack
            w="full"
            h="auto"
            align="start"
            justify="start"
            spacing={3}
            p={3}
        >
            <HStack>
                <CircularProgress
                    size={16}
                    thickness={6}
                    value={progress}
                    color={useColorModeValue(`${progressBarColor}.500`, `${progressBarColor}.200`)}
                    trackColor={useColorModeValue('gray.100', 'gray.700')}
                />
                <VStack
                    align="start"
                    justify="start"
                    spacing={1}
                >
                    <Text
                        fontSize="2xl"
                        lineHeight={1}
                    >
                        {betterPrintData.trayName}
                    </Text>
                    <Text fontSize="sm">in 7 hours</Text>
                    {/* <HStack
                        w="full"
                        align="center"
                        justify="start"
                        fontSize="sm"
                    >
                        <Icon as={iconSet.person} />
                        <Text fontSize="sm">Colin Hartigan</Text>
                    </HStack> */}
                </VStack>
            </HStack>
            <Divider />
            <HStack
                w="full"
                align="start"
                justify="start"
            >
                <VStack
                    spacing={0}
                    align="start"
                >
                    <HStack fontSize="sm">
                        <Icon as={iconSet.printer} />
                        <Text>Printer</Text>
                    </HStack>
                    <Text
                        fontSize="2xl"
                        fontWeight="semibold"
                    >
                        Left stratasys
                    </Text>
                </VStack>
            </HStack>
        </VStack>
        //     </CardBody>
        // </Card>
    );
}
