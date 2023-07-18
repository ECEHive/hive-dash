import { useContext, useState, useEffect } from 'react';

import { VStack, HStack, Heading } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

import PrinterType from '@/components/printing/new/PrinterType';
import PrinterItem from '@/components/printing/new/PrinterItem';
import PrintingContext from '@/contexts/PrintingContext';

export default function PrinterSelect({ set, data, setNext }) {
    const { printerTypes, printers } = useContext(PrintingContext);

    useEffect(() => {
        console.log(printers, printerTypes)
    }, [printers])

    useEffect(() => {
        if (data.printer.type !== '' && data.printer.name !== '') {
            setNext(true);
        } else {
            setNext(false);
        }
    }, [data]);

    return (
        <>
            <Heading size="lg" fontFamily="body">
                Printer
            </Heading>

            <HStack
                w="100%"
                h="auto"
                spacing={3}
                justify="start"
                overflow="auto"
            >
                <VStack
                    spacing={3}
                    w="300px"
                    h="100%"
                    justify="flex-start"
                    overflow="auto"
                >
                    {printerTypes.map((typeData) => {
                        return (
                            <PrinterType
                                isActive={data.printer.type === typeData.id}
                                data={typeData}
                                onClick={() => {
                                    set({
                                        ...data,
                                        printer: {
                                            ...data.printer,
                                            name: '',
                                            type: typeData.id
                                        }
                                    });
                                }}
                            />
                        );
                    })}
                </VStack>

                <ChevronRightIcon boxSize={10} />

                <VStack
                    spacing={3}
                    w="300px"
                    h="100%"
                    justify="flex-start"
                    overflow="auto"
                >
                    {data.printer.type !== '' &&
                        printers
                            .filter((p) => p.type === data.printer.type)
                            .map((printer) => {
                                console.log(printer);
                                return (
                                    <PrinterItem
                                        isActive={
                                            data.printer.name ===
                                            printer.displayName
                                        }
                                        data={printer}
                                        onClick={() => {
                                            set({
                                                ...data,
                                                printer: {
                                                    ...data.printer,
                                                    name: printer.displayName,
                                                    id: printer.id
                                                }
                                            });
                                        }}
                                    />
                                );
                            })}
                    ;
                </VStack>
            </HStack>
        </>
    );
}
