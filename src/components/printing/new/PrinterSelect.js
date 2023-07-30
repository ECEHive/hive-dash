import { useContext, useEffect } from 'react';

import { Badge, Button, Card, CardBody, HStack, Heading, Spacer, Text, VStack } from '@chakra-ui/react';

import { ChevronRightIcon } from '@chakra-ui/icons';

import PrintingContext from '@/contexts/printing/PrintingContext';

import usePrinterParser from '@/hooks/printing/usePrinterParser';

import { StateColors } from '@/util/states';

function PrinterItem({ data, onClick, isActive }) {
    const { expandedPrinterData } = usePrinterParser(data);

    return (
        <Card
            as={Button}
            variant="outline"
            h="auto"
            w="100%"
            p={0}
            bgColor="transparent"
            onClick={onClick}
            isActive={isActive}
        >
            <CardBody w="100%">
                <VStack
                    w="100%"
                    h="100%"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    <VStack
                        w="100%"
                        h="100%"
                        spacing={1}
                        alignItems="flex-start"
                    >
                        <HStack w="100%">
                            <Heading
                                size="md"
                                fontWeight="medium"
                                fontFamily="heading"
                            >
                                {expandedPrinterData.displayName}
                            </Heading>
                            <Spacer />
                            <Badge
                                colorScheme={StateColors[expandedPrinterData.state]}
                                variant="subtle"
                            >
                                {expandedPrinterData.state}
                            </Badge>
                        </HStack>
                        <Text
                            fontSize="md"
                            fontWeight="normal"
                        >
                            {expandedPrinterData.queueLength} in queue
                        </Text>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
}

function PrinterType({ data, onClick, isActive }) {
    return (
        <Card
            as={Button}
            variant="outline"
            h="auto"
            w="300px"
            p={0}
            bgColor="transparent"
            onClick={onClick}
            isActive={isActive}
        >
            <CardBody w="100%">
                <VStack
                    w="100%"
                    h="100%"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                >
                    <VStack
                        w="100%"
                        h="100%"
                        spacing={1}
                        alignItems="flex-start"
                    >
                        <Heading
                            size="md"
                            fontWeight="medium"
                        >
                            {data.displayName}
                        </Heading>
                        <Text
                            fontSize="md"
                            fontWeight="normal"
                        >
                            {data.description}
                        </Text>
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    );
}

export default function PrinterSelect({ set, data, setNext }) {
    const { printerTypes, printers } = useContext(PrintingContext);

    useEffect(() => {
        if (data.printer.type !== '' && data.printer.name !== '') {
            setNext(true);
        } else {
            setNext(false);
        }
    }, [data, setNext]);

    return (
        <>
            <Heading
                size="lg"
                fontFamily="body"
            >
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
                                key={typeData.id}
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
                                return (
                                    <PrinterItem
                                        key={printer.id}
                                        isActive={data.printer.name === printer.displayName}
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
