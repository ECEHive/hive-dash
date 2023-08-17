import { useMemo, useState } from 'react';

import {
    Alert,
    AlertDescription,
    Badge,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Checkbox,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputRightAddon,
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

import { Field, Form, Formik } from 'formik';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrinterParser from '@/hooks/printing/usePrinterParser';

import iconSet from '@/util/icons';
import { PrinterStates, StateColors } from '@/util/states';

import Select from '@/components/Select';

function PrinterItem({ printer, ...props }) {
    const { expandedPrinterData: printerData } = usePrinterParser(printer);

    const queueTime = useMemo(() => {
        let time = dayjs.duration(0, 'seconds');

        printerData.queue.forEach((job) => {
            console.log(job.estTime);
            time = time.add(dayjs.duration(job.estTime));
        });

        // NOTE: could add a way to pad for closed time to make more accurate estimations

        return time.humanize();
    }, [printerData.queue]);

    return (
        <Card
            {...props}
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
                                <Heading size="md">{printerData.displayName}</Heading>
                                {printerData.state === PrinterStates.DOWN && (
                                    <Badge colorScheme={StateColors[printerData.state]}>{printerData.state}</Badge>
                                )}
                            </HStack>

                            <HStack
                                fontWeight="normal"
                                fontSize="md"
                                color="secondaryTextAlt"
                                spacing={2}
                                w="full"
                            >
                                <Icon as={iconSet.queue} />
                                <Text>3 prints in queue</Text>
                            </HStack>
                        </VStack>
                        <Spacer />

                        <VStack
                            align="end"
                            spacing={1}
                        >
                            <Text fontSize="3xl">{queueTime}</Text>
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
    const { printerTypes, printers, peerInstructors } = usePrinting();

    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: "Who's queueing the print?"
        },
        {
            title: 'Printer type'
        },
        {
            title: 'Printer'
        },
        {
            title: 'End user info'
        },
        {
            title: 'Print info'
        }
    ];

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            isCentered
            size="lg"
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <ModalContent>
                <Formik
                    initialValues={{
                        pi: '',
                        printerType: '',
                        printer: '',
                        firstName: '',
                        lastName: '',
                        email: '',
                        printName: '',
                        material: '',
                        materialUsage: '',
                        estTimeHours: '',
                        estTimeMinutes: ''
                    }}
                    onSubmit={() => {}}
                >
                    {(props) => (
                        <Form>
                            <ModalHeader pb={0}>New print</ModalHeader>
                            <ModalCloseButton />

                            <ModalBody>
                                <VStack>
                                    <VStack
                                        spacing={0}
                                        w="full"
                                        align="start"
                                    >
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

                                                    <StepSeparator _horizontal={{ ml: '0' }} />
                                                </Step>
                                            ))}
                                        </Stepper>
                                        <Text
                                            fontSize="2xl"
                                            fontWeight="semibold"
                                            alignSelf="start"
                                        >
                                            {steps[activeStep].title}
                                        </Text>
                                    </VStack>

                                    <Divider mb={2} />

                                    <VStack w="full">
                                        {activeStep === 0 && (
                                            <>
                                                <Field name="pi">
                                                    {({ form, field }) => (
                                                        <FormControl>
                                                            <Select
                                                                {...field}
                                                                w="full"
                                                                placeholder="PI name"
                                                                options={peerInstructors.map((pi) => ({
                                                                    label: pi.name,
                                                                    value: pi.name
                                                                }))}
                                                                onChange={(selectedOption) => {
                                                                    return form.setFieldValue('pi', selectedOption);
                                                                }}
                                                                value={field?.value}
                                                            />
                                                            <FormHelperText>
                                                                maybe make this autofill to whoever&apos;s logged in
                                                                eventually
                                                            </FormHelperText>
                                                        </FormControl>
                                                    )}
                                                </Field>
                                            </>
                                        )}

                                        {activeStep === 1 && (
                                            <>
                                                <Field name="printerType">
                                                    {({ form, field }) => (
                                                        <>
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
                                                                            onClick={() => {
                                                                                props.setFieldValue(
                                                                                    'printerType',
                                                                                    type
                                                                                );
                                                                            }}
                                                                            isActive={field.value?.id === type.id}
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
                                                                                            <Heading size="md">
                                                                                                {type.displayName}
                                                                                            </Heading>
                                                                                            <Text fontWeight="normal">
                                                                                                {type.description}
                                                                                            </Text>
                                                                                        </VStack>
                                                                                    </HStack>
                                                                                </VStack>
                                                                            </CardBody>
                                                                        </Card>
                                                                    </>
                                                                );
                                                            })}
                                                        </>
                                                    )}
                                                </Field>
                                            </>
                                        )}

                                        {activeStep === 2 && (
                                            <>
                                                <Field name="printer">
                                                    {({ form, field }) => {
                                                        console.log(form);

                                                        return (
                                                            <>
                                                                {printers
                                                                    .filter(
                                                                        (p) => p.type === form.values.printerType?.id
                                                                    )
                                                                    .map((printer) => {
                                                                        return (
                                                                            <PrinterItem
                                                                                key={printer.id}
                                                                                printer={printer}
                                                                                onClick={() => {
                                                                                    props.setFieldValue(
                                                                                        'printer',
                                                                                        printer
                                                                                    );
                                                                                }}
                                                                                isActive={
                                                                                    field.value?.id === printer.id
                                                                                }
                                                                            />
                                                                        );
                                                                    })}
                                                            </>
                                                        );
                                                    }}
                                                </Field>
                                            </>
                                        )}

                                        {activeStep === 3 && (
                                            <>
                                                <HStack>
                                                    <Field name="firstName">
                                                        {({ form, field }) => (
                                                            <FormControl>
                                                                <FormLabel>First name</FormLabel>
                                                                <Input {...field} />
                                                            </FormControl>
                                                        )}
                                                    </Field>

                                                    <Field name="lastName">
                                                        {({ form, field }) => (
                                                            <FormControl>
                                                                <FormLabel>Last name</FormLabel>
                                                                <Input {...field} />
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </HStack>

                                                <Field name="email">
                                                    {({ form, field }) => (
                                                        <FormControl>
                                                            <FormLabel>@gatech.edu email</FormLabel>
                                                            <InputGroup>
                                                                <Input {...field} />
                                                                <InputRightAddon>@gatech.edu</InputRightAddon>
                                                            </InputGroup>
                                                        </FormControl>
                                                    )}
                                                </Field>
                                            </>
                                        )}

                                        {activeStep === 4 && (
                                            <>
                                                <Field name="printName">
                                                    {({ form, field }) => (
                                                        <FormControl>
                                                            <FormLabel>Print name</FormLabel>
                                                            <Input {...field} />
                                                        </FormControl>
                                                    )}
                                                </Field>

                                                <HStack w="full">
                                                    <Field name="material">
                                                        {({ form, field }) => (
                                                            <FormControl>
                                                                <FormLabel>Material</FormLabel>
                                                                <Select
                                                                    options={form.values.printerType.materials.map(
                                                                        (material) => {
                                                                            return {
                                                                                label: material,
                                                                                value: material
                                                                            };
                                                                        }
                                                                    )}
                                                                    onChange={(selectedOption) => {
                                                                        return form.setFieldValue(
                                                                            'material',
                                                                            selectedOption
                                                                        );
                                                                    }}
                                                                    value={field?.value}
                                                                />
                                                            </FormControl>
                                                        )}
                                                    </Field>

                                                    <Field name="materialUsage">
                                                        {({ form, field }) => (
                                                            <FormControl>
                                                                <FormLabel>Material usage</FormLabel>
                                                                <InputGroup>
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                    />
                                                                    <InputRightAddon>in</InputRightAddon>
                                                                </InputGroup>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </HStack>

                                                <FormControl>
                                                    <FormLabel>Estimated print time</FormLabel>
                                                    <VStack>
                                                        <HStack>
                                                            <Field name="estTimeHours">
                                                                {({ form, field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                        placeholder="hours"
                                                                    />
                                                                )}
                                                            </Field>
                                                            <Text
                                                                fontSize="xl"
                                                                fontWeight="medium"
                                                            >
                                                                {':'}
                                                            </Text>
                                                            <Field name="estTimeMinutes">
                                                                {({ form, field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                        placeholder="minutes"
                                                                    />
                                                                )}
                                                            </Field>
                                                            <Icon
                                                                fontSize="2xl"
                                                                as={iconSet.rightArrow}
                                                            />
                                                            <Text
                                                                fontSize="2xl"
                                                                fontWeight="medium"
                                                            >
                                                                {dayjs
                                                                    .duration(
                                                                        `PT${props.values.estTimeHours}H${props.values.estTimeMinutes}M`
                                                                    )
                                                                    .format('HH:mm')}
                                                            </Text>
                                                        </HStack>
                                                        {props.values.estTimeHours >= 8 &&
                                                        props.values.estTimeMinutes >= 0 ? (
                                                            <Alert
                                                                status="error"
                                                                borderRadius="md"
                                                            >
                                                                <HStack>
                                                                    <Checkbox colorScheme="red" />
                                                                    <AlertDescription>
                                                                        Verify the end user has permission for this
                                                                        print
                                                                    </AlertDescription>
                                                                </HStack>
                                                            </Alert>
                                                        ) : null}
                                                    </VStack>
                                                </FormControl>
                                            </>
                                        )}
                                    </VStack>
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
                                        isDisabled={activeStep <= 0}
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
                                        isDisabled={activeStep >= steps.length - 1}
                                    >
                                        Next
                                    </Button>
                                </ButtonGroup>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
    );
}
