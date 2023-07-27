import { useMemo } from 'react';

import {
    Badge,
    Box,
    Card,
    CardBody,
    CircularProgress,
    CircularProgressLabel,
    Divider,
    Flex,
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
    const { betterPrintData, printerData, updatedAtHumanized } = usePrintParser(print);
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
            <CardBody p={0}>
                <Box p={5}>
                    <VStack
                        w="full"
                        h="auto"
                        align="start"
                        justify="start"
                        spacing={3}
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
                                </HStack>
                                <HStack
                                    fontSize="md"
                                    color={secondaryAlt}
                                    spacing={2}
                                >
                                    <Icon as={iconSet.clock} />
                                    <Text fontSize="sm">{timeLeftHumanizedDetailed}</Text>
                                </HStack>
                            </VStack>
                            <Spacer />
                            <VStack
                                spacing={1}
                                color={secondary}
                                justify="start"
                                h="full"
                            >
                                <HStack
                                    h="full"
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
                                            <HStack
                                                fontSize="sm"
                                                color={secondaryAlt}
                                            >
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
                                        {i < dataFields.length - 1 && (
                                            <Divider
                                                orientation="vertical"
                                                h="50px"
                                            />
                                        )}
                                    </>
                                );
                            })}
                        </HStack>
                    </VStack>
                </Box>
                <Flex
                    w="full"
                    h="auto"
                    align="center"
                    justify="end"
                    dir="row"
                    py={1}
                    px={3}
                    borderTop="1px"
                    borderColor="chakra-border-color"
                    gap={3}
                >
                    {/* <Badge fontSize="2xs">{progressMessage}</Badge>
                    <Spacer /> */}
                    <HStack
                        fontSize="xs"
                        color={secondary}
                        spacing={1}
                    >
                        <Icon as={iconSet.peerInstructor} />
                        <Text>{betterPrintData.queuedBy}</Text>
                    </HStack>
                    <HStack
                        fontSize="xs"
                        color={secondary}
                        spacing={1}
                    >
                        <Icon as={iconSet.refresh} />
                        <Text>{betterPrintData.updatedAtHumanized}</Text>
                    </HStack>
                </Flex>
            </CardBody>
        </Card>
    );
}
