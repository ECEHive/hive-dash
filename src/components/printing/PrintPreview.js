import { useMemo } from 'react';

import {
    Card,
    CardBody,
    CircularProgress,
    Flex,
    HStack,
    Icon,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import Image from 'next/image';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';

import iconSet from '@/util/icons';

export default function PrintPreview({ print }) {
    const { betterPrintData, printerData } = usePrintParser(print);
    const {
        progressBarColor,
        progressMessage,
        progress,
        progressCircleColor,
        progressMessageColor,
        timeLeftHumanized,
        timeLeftHumanizedDetailed
    } = usePrintProgress(print);

    const dataFields = useMemo(() => {
        return [
            {
                label: 'Printer',
                icon: iconSet.printer,
                value: printerData?.displayName || betterPrintData.printer
            },
            {
                label: 'Material',
                icon: iconSet.material,
                value: betterPrintData.materialType
            },
            {
                label: 'Est. material',
                icon: iconSet.materialAmount,
                value: betterPrintData.materialUsage,
                suffix: betterPrintData.materialSymbol
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
            overflow="hidden"
            //bgColor={useColorModeValue('gray.200', 'gray.600')}
        >
            <CardBody
                p={0}
                h="auto"
                w="full"
                overflow="hidden"
            >
                {/* <Box
                    p={5}
                    pb={3}
                    maxW="full"
                > */}
                <VStack
                    w="full"
                    h="auto"
                    align="start"
                    justify="start"
                    oveflow="hidden"
                    spacing={0}
                >
                    <HStack
                        w="full"
                        p={5}
                        borderBottom="1px"
                        borderColor="chakra-border-color"
                        position="relative"
                        overflow="hidden"
                    >
                        <CircularProgress
                            size={16}
                            thickness={6}
                            value={progress}
                            color={progressCircleColor}
                            trackColor="progressTrackAlt"
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
                                    fontWeight="medium"
                                >
                                    {betterPrintData.trayName}
                                </Text>
                            </HStack>
                            <HStack
                                fontSize="md"
                                color="secondaryTextAlt"
                                spacing={2}
                            >
                                <Icon as={iconSet.clock} />
                                <Text fontSize="sm">{timeLeftHumanizedDetailed}</Text>
                            </HStack>
                        </VStack>

                        <Image
                            src={betterPrintData?.preview}
                            alt="print preview"
                            height={20}
                            width={100}
                            style={{
                                overflow: 'hidden',
                                right: 20,
                                position: 'absolute',
                                background: `linear-gradient(to right, ${useColorModeValue(
                                    'gray.200',
                                    'gray.700'
                                )} 0%, ${useColorModeValue('gray.700', 'gray.200')} 100%)`
                            }}
                            hidden={!betterPrintData?.preview}
                        />
                        {/* <Spacer />
                        <VStack
                            spacing={1}
                            color="secondaryText"
                            justify="center"
                            h="full"
                            backdropBlur={3}
                            bgColor="rgba(255, 255, 255, 0.5)"
                            zIndex={2}
                        >
                            <HStack
                                h="full"
                                w="full"
                                align="center"
                                justify="start"
                                fontSize="sm"
                            >
                                <Icon as={iconSet.calendarAdd} />
                                <Text>{betterPrintData.queuedAtFormatted}</Text>
                            </HStack>
                            <HStack
                                h="full"
                                w="full"
                                align="center"
                                justify="start"
                                fontSize="sm"
                            >
                                <Icon as={iconSet.person} />
                                <Text>
                                    {betterPrintData.endUser.firstname} {betterPrintData.endUser.lastname}
                                </Text>
                            </HStack>
                        </VStack> */}
                    </HStack>

                    <HStack
                        w="full"
                        h="auto"
                        px={5}
                        py={3}
                    >
                        <HStack
                            w="auto"
                            h="auto"
                            align="center"
                            justify="start"
                            pb={2}
                            spacing={3}
                            overflow="auto"
                            whiteSpace="nowrap"
                            // borderRight={actions && '1px'}
                            // borderRightColor={actions && 'chakra-border-color'}
                        >
                            {dataFields.map((field, i) => {
                                return (
                                    <>
                                        <VStack
                                            spacing={1}
                                            align="start"
                                        >
                                            <HStack
                                                fontSize="sm"
                                                color="secondaryTextAlt"
                                            >
                                                <Icon as={field.icon} />
                                                <Text>{field.label}</Text>
                                            </HStack>
                                            <HStack
                                                alignItems="end"
                                                spacing={1}
                                            >
                                                <Text
                                                    fontSize="2xl"
                                                    fontWeight="semibold"
                                                    lineHeight={1}
                                                >
                                                    {field.value}
                                                </Text>
                                                {field.suffix && <Text fontSize="sm">{field.suffix}</Text>}
                                            </HStack>
                                        </VStack>
                                        {i < dataFields.length - 1 && (
                                            <Icon
                                                color="secondaryText"
                                                fontSize="sm"
                                                as={iconSet.dot}
                                            />
                                        )}
                                    </>
                                );
                            })}
                        </HStack>
                        {/* <Spacer />
                            <VStack
                                h="full"
                                justify="end"
                            >
                                {actions}
                            </VStack> */}
                    </HStack>
                </VStack>
                {/* </Box> */}
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
                    bgColor={useColorModeValue('gray.100', 'gray.700')}
                >
                    {/* <Badge fontSize="2xs">{progressMessage}</Badge>
                    <Spacer /> */}
                    <HStack
                        fontSize="xs"
                        color="secondaryText"
                        spacing={1}
                    >
                        <Icon as={iconSet.peerInstructor} />
                        <Text>{betterPrintData.queuedBy}</Text>
                    </HStack>
                    <HStack
                        fontSize="xs"
                        color="secondaryText"
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
