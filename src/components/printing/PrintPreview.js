import { useMemo } from 'react';

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
import useTextColor from '@/hooks/useTextColor';

import iconSet from '@/util/icons';

export default function PrintPreview({ actions, print }) {
    const { betterPrintData, printerData } = usePrintParser(print);
    const {
        progressBarColor,
        progressMessage,
        progress,
        progressMessageColor,
        timeLeftHumanized,
        timeLeftHumanizedDetailed
    } = usePrintProgress(print);

    const { secondaryAlt, secondary } = useTextColor();

    const dataFields = useMemo(() => {
        return [
            {
                label: 'Printer',
                icon: iconSet.printer,
                value: printerData.displayName
            },
            {
                label: 'Material',
                icon: iconSet.material,
                value: betterPrintData.materialType
            },
            {
                label: 'Est. time',
                icon: iconSet.clock,
                value: betterPrintData.estTimeFormatted
            }
        ];
    }, [printerData, betterPrintData]);

    return (
        <Card
            w="100%"
            h="auto"
            variant="outline"
            background="transparent"
            //bgColor={useColorModeValue('gray.200', 'gray.600')}
        >
            <CardBody>
                <VStack
                    w="full"
                    h="auto"
                    align="start"
                    justify="start"
                    spacing={3}
                    // p={3}
                >
                    <HStack w="full">
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
                            <HStack>
                                <Text
                                    fontSize="2xl"
                                    lineHeight={1}
                                >
                                    {betterPrintData.trayName}
                                </Text>
                                {/* <Badge
                                    fontSize="sm"
                                    colorScheme={progressMessageColor}
                                >
                                    {progressMessage}
                                </Badge> */}
                            </HStack>
                            <HStack
                                fontSize="sm"
                                color={secondaryAlt}
                            >
                                <Icon as={iconSet.clock} />
                                <Text fontSize="sm">{timeLeftHumanizedDetailed}</Text>
                            </HStack>
                        </VStack>
                        <Spacer />
                        <VStack
                            spacing={1}
                            color={secondary}
                        >
                            <HStack
                                w="full"
                                align="center"
                                justify="start"
                                fontSize="sm"
                            >
                                <Icon as={iconSet.person} />
                                <Text fontSize="sm">
                                    {betterPrintData.endUser.firstname} {betterPrintData.endUser.lastname}
                                </Text>
                            </HStack>
                            <HStack
                                w="full"
                                align="center"
                                justify="start"
                                fontSize="sm"
                            >
                                <Icon as={iconSet.peerInstructor} />
                                <Text fontSize="sm">{betterPrintData.queuedBy}</Text>
                            </HStack>
                        </VStack>
                    </HStack>
                    <Divider w="full" />
                    <HStack
                        w="full"
                        h="auto"
                        align="center"
                        justify="start"
                        spacing={6}
                    >
                        {dataFields.map((field, i) => {
                            return (
                                <>
                                    <VStack
                                        spacing={0}
                                        align="start"
                                    >
                                        <HStack fontSize="sm">
                                            <Icon as={field.icon} />
                                            <Text>{field.label}</Text>
                                        </HStack>
                                        <Text
                                            fontSize="2xl"
                                            fontWeight="semibold"
                                        >
                                            {field.value}
                                        </Text>
                                    </VStack>
                                    <Divider
                                        orientation="vertical"
                                        h="50px"
                                    />
                                </>
                            );
                        })}
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
