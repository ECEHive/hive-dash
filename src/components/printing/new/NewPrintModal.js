import { useMemo, useReducer, useState } from 'react';

import {
    Badge,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    HStack,
    Heading,
    Icon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Step,
    StepIcon,
    StepIndicator,
    StepSeparator,
    StepStatus,
    Stepper,
    Text,
    VStack
} from '@chakra-ui/react';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrinterParser from '@/hooks/printing/usePrinterParser';

import iconSet from '@/util/icons';
import { StateColors } from '@/util/states';

function PrinterItem({ printer }) {
    const { expandedPrinterData: printerData } = usePrinterParser(printer);

    const queueTime = useMemo(() => {
        const time = printerData.queue.reduce((acc, cur) => {
            acc.add(dayjs(cur.estTime));
        });
    }, [printerData.queue]);

    return (
        <Card
            variant="outline"
            bg="transparent"
            w="full"
            as={Button}
            h="auto"
            p={0}
        >
            <CardBody
                p={4}
                w="full"
            >
                <VStack spacing={5}>
                    <HStack w="full">
                        <VStack
                            w="full"
                            align="start"
                        >
                            <HStack>
                                <Heading
                                    size="md"
                                    fontWeight="semibold"
                                >
                                    {printerData.displayName}
                                </Heading>
                                <Badge colorScheme={StateColors[printerData.state]}>{printerData.state}</Badge>
                            </HStack>

                            <HStack
                                fontWeight="normal"
                                fontSize="md"
                                color="secondaryTextAlt"
                                spacing={2}
                            >
                                <Icon as={iconSet.queue} />
                                <Text>3 prints in queue</Text>
                            </HStack>
                        </VStack>
                        <Spacer />

                        <VStack
                            align="start"
                            gap={1}
                        >
                            <Text fontSize="3xl">10:40</Text>
                            <HStack
                                fontSize="sm"
                                fontWeight="normal"
                                color="secondaryTextAlt"
                                spacing={2}
                            >
                                <Icon as={iconSet.clock} />
                                <Text>est wait</Text>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
}

export default function NewPrintModal({ open, onClose }) {
    const { printerTypes, printers } = usePrinting();

    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: 'Printer type'
        },
        {
            title: 'Printer'
        },
        {
            title: 'Print'
        },
        {
            title: 'User'
        }
    ];

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            isCentered
            size="xl"
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <ModalContent h="auto">
                <ModalHeader pb={0}>New print</ModalHeader>
                <ModalCloseButton />

                <ModalBody h="100%">
                    <VStack>
                        <Stepper
                            size="sm"
                            w="100%"
                            minH="50px"
                            index={activeStep}
                            gap={0}
                        >
                            {steps.map((step, index) => (
                                <Step
                                    key={index}
                                    gap={0}
                                >
                                    <StepIndicator>
                                        <StepStatus
                                            complete={<StepIcon />}
                                            // incomplete={<StepNumber />}
                                            // active={<StepNumber />}
                                        />
                                    </StepIndicator>

                                    {/* <Box flexShrink={0}>
                                        <StepTitle>{step.title}</StepTitle>
                                        <StepDescription>{step.description}</StepDescription>
                                    </Box> */}

                                    <StepSeparator _horizontal={{ ml: '0' }} />
                                </Step>
                            ))}
                        </Stepper>

                        {activeStep === 0 && (
                            <VStack w="full">
                                {printerTypes.map((type) => {
                                    return (
                                        <>
                                            <Card
                                                key={type.id}
                                                variant="outline"
                                                bg="transparent"
                                                w="full"
                                                as={Button}
                                                h="auto"
                                                p={0}
                                            >
                                                <CardBody
                                                    p={4}
                                                    w="full"
                                                >
                                                    <VStack spacing={5}>
                                                        <HStack w="full">
                                                            <VStack
                                                                w="full"
                                                                align="start"
                                                                spacing={1}
                                                            >
                                                                <Heading size="md">{type.displayName}</Heading>
                                                                <Text fontWeight="normal">{type.description}</Text>
                                                            </VStack>
                                                            <Spacer />
                                                            {/* <Icon
                                                                fontSize="3xl"
                                                                as={iconSet.dropdownClosed}
                                                            /> */}
                                                        </HStack>
                                                    </VStack>
                                                </CardBody>
                                            </Card>
                                        </>
                                    );
                                })}
                            </VStack>
                        )}

                        {activeStep === 1 && (
                            <VStack w="full">
                                {printers
                                    .filter((p) => p.type === 'stratasys')
                                    .map((printer) => {
                                        return (
                                            <PrinterItem
                                                key={printer.id}
                                                printer={printer}
                                            />
                                        );
                                    })}
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter spacing={3}>
                    <ButtonGroup w="full">
                        <Button
                            colorScheme="blue"
                            leftIcon={<Icon as={iconSet.leftArrow} />}
                            onClick={() => {
                                setActiveStep((s) => s - 1);
                            }}
                        >
                            Previous
                        </Button>
                        <Spacer />
                        <Button
                            colorScheme="blue"
                            rightIcon={<Icon as={iconSet.rightArrow} />}
                            onClick={() => {
                                setActiveStep((s) => s + 1);
                            }}
                        >
                            Next
                        </Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
