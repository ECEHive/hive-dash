import { useMemo } from 'react';

import { HStack, Icon, Tag, TagLabel, TagLeftIcon, Text, VStack } from '@chakra-ui/react';

import Link from 'next/link';

import usePrintParser from '@/hooks/printing/usePrintParser';

import iconSet from '@/util/icons';

export default function PrintInfoFields({ fields, print }) {
    const { betterPrintData, printerData, printerTypeData } = usePrintParser(print);

    const dataFields = useMemo(() => {
        return [
            {
                name: 'printer',
                icon: iconSet.printer,
                value: printerData?.displayName || betterPrintData?.printer,
                link: `/printing/printers/${betterPrintData?.printer}`,
                type: 'tag',
                color: printerTypeData?.color
            },
            {
                name: 'material',
                icon: iconSet.material,
                value: betterPrintData?.materialType
            },
            {
                name: 'materialAmount',
                icon: iconSet.materialAmount,
                value: betterPrintData?.materialUsage,
                suffix: betterPrintData?.materialSymbol
            },
            {
                name: 'estTime',
                icon: iconSet.clock,
                value: betterPrintData?.estTimeFormatted
            }
        ];
    }, [printerData, betterPrintData, printerTypeData]);

    return (
        <>
            <HStack
                w="auto"
                h="auto"
                align="center"
                justify="start"
                pb={2}
                spacing={2}
                overflow="auto"
                whiteSpace="nowrap"
                // borderRight={actions && '1px'}
                // borderRightColor={actions && 'chakra-border-color'}
            >
                {fields.map((field, i) => {
                    const dataField = dataFields.find((f) => f.name === field);
                    return (
                        <>
                            <VStack
                                spacing={1}
                                align="start"
                            >
                                {dataField?.type === 'tag' ? (
                                    <Tag
                                        size="lg"
                                        colorScheme={dataField?.color}
                                        as={dataField.link ? Link : 'span'}
                                        fontWeight="medium"
                                        href={dataField?.link}
                                    >
                                        <TagLeftIcon as={dataField.icon} />
                                        <TagLabel fontWeight="medium">{dataField?.value}</TagLabel>
                                    </Tag>
                                ) : (
                                    <HStack
                                        alignItems="center"
                                        spacing={2}
                                        color="secondaryText"
                                    >
                                        <Icon
                                            fontSize="lg"
                                            as={dataField.icon}
                                        />
                                        <HStack
                                            align="end"
                                            spacing={1}
                                            height="full"
                                        >
                                            <Text
                                                as={dataField.link ? Link : 'span'}
                                                fontSize="xl"
                                                fontWeight="medium"
                                                lineHeight={1}
                                                href={dataField?.link}
                                            >
                                                {dataField.value}
                                            </Text>
                                            {dataField.suffix && <Text fontSize="sm">{dataField.suffix}</Text>}
                                        </HStack>
                                    </HStack>
                                )}
                            </VStack>
                            {i < fields.length - 1 && (
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
        </>
    );
}
