import { useMemo, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Badge,
    Box,
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
    Spinner,
    Step,
    StepIcon,
    StepIndicator,
    StepSeparator,
    StepStatus,
    Stepper,
    Text,
    VStack
} from '@chakra-ui/react';

import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { Field, Form, Formik } from 'formik';
import { Image } from 'image-js';

import { storage } from '@/lib/firebase';
import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrinterParser from '@/hooks/printing/usePrinterParser';

import dataUrlToBlob from '@/util/dataUrlToBlob';
import iconSet from '@/util/icons';
import { PrintStates, PrinterStates, StateColors } from '@/util/states';

import Select from '@/components/Select';
import STLInput from '@/components/printing/new/STLInput';

function PrinterItem({ printer, ...props }) {
    const { expandedPrinterData: printerData } = usePrinterParser(printer);

    const queueTime = useMemo(() => {
        let time = dayjs.duration(0, 'seconds');

        printerData.queue.forEach((job) => {
            console.log(job.estTime);
            time = time.add(dayjs.duration(job.estTime));
        });

        // NOTE: could add a way to pad for closed time to make more accurate estimations
        if (time.asSeconds() > 10) {
            return time.humanize();
        } else {
            return 'none';
        }
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
                                <Text>{printerData.queueLength} prints in queue</Text>
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

export default function NewPrintModal({ isOpen, onClose }) {
    const { printerTypes, printers, peerInstructors } = usePrinting();

    const [activeStep, setActiveStep] = useState(0);
    const [STLPreview, setSTLPreview] = useState(null);

    const steps = [
        'STL preview',
        "Who's queueing the print?",
        'Printer type',
        'Printer',
        'End user info',
        'Print info',
        'Submitting',
        'Submitted'
    ];

    const uploadPreview = (inputImage, name) => {
        return new Promise(async (resolve, reject) => {
            const blob = dataUrlToBlob(inputImage);
            const buffer = await blob.arrayBuffer();

            const image = await Image.load(buffer);

            //crop image to 512x512 at center, but if image is smaller than 512x512, just use the whole image and add padding so it's 512x51
            //resize the image such that height is 512
            const resizedImage = image.resize({
                height: 512,
                width: null,
                preserveAspectRatio: true
            });

            console.log(resizedImage);

            const croppedImage = resizedImage.crop({
                x: (resizedImage.width - 512) / 2,
                y: (resizedImage.height - 512) / 2,
                width: image.width < 512 ? image.width : 512,
                height: image.height < 512 ? image.height : 512
            });

            const imgBuffer = croppedImage.toBuffer();

            // convert to base64
            const converted = Buffer.from(imgBuffer).toString('base64');

            //upload photo to firestore
            const storageRef = ref(storage, `/previews/${name}`);

            // progress can be paused and resumed. It also exposes progress updates.
            // Receives the storage reference and the file to upload.
            uploadString(storageRef, converted, 'base64').then((snapshot) => {
                getDownloadURL(snapshot.ref)
                    .then((url) => {
                        resolve(url);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        });
    };

    return (
        <Formik
            initialValues={{
                pi: {},
                printerType: '',
                printer: '',
                firstName: '',
                lastName: '',
                email: '',
                printName: '',
                material: {},
                materialUsage: '',
                estTimeHours: '',
                estTimeMinutes: ''
            }}
            onSubmit={(values, actions) => {
                uploadPreview(STLPreview, values.printName)
                    .then((url) => {
                        const timestamp = dayjs.utc();

                        const payload = {
                            trayName: values.printName,
                            printer: values.printer.id,
                            estTime: dayjs.duration(`PT${values.estTimeHours}H${values.estTimeMinutes}M`).toISOString(),
                            materialType: values.material.value,
                            materialUsage: values.materialUsage,
                            queuedBy: values.pi.value,
                            queuedAt: timestamp,
                            notes: '',
                            state: PrintStates.QUEUED,
                            preview: url,
                            endUser: {
                                firstname: values.firstName,
                                lastname: values.lastName,
                                email: values.email
                            },
                            events: [
                                {
                                    type: PrintStates.QUEUED,
                                    timestamp: timestamp,
                                    notes: ''
                                }
                            ]
                        };

                        fetch('/api/printing/queue', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        })
                            .then((res) => res.json())
                            .then((res) => {
                                actions.setSubmitting(false);
                                setActiveStep((s) => s + 1);
                            })
                            .catch((err) => {
                                toast({
                                    title: 'Error',
                                    description: `Couldn't queue the print: ${err.message}`,
                                    status: 'error',
                                    duration: 5000
                                });
                            });
                    })
                    .catch((err) => {
                        toast({
                            title: 'Error uploading preview',
                            description: err.message,
                            status: 'error',
                            duration: 5000
                        });
                    });
            }}
        >
            {(props) => (
                <Modal
                    isOpen={isOpen}
                    onClose={() => {
                        onClose();
                        setActiveStep(0);
                        setSTLPreview(null);
                        props.handleReset();
                    }}
                    isCentered
                    size="lg"
                    scrollBehavior="inside"
                    closeOnOverlayClick={false}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <Form>
                            <ModalHeader pb={0}>New print</ModalHeader>
                            <ModalCloseButton />

                            <ModalBody
                                display="flex"
                                flexDir="column"
                                gap={2}
                            >
                                <VStack
                                    spacing={0}
                                    w="full"
                                    h="auto"
                                    align="start"
                                >
                                    <Stepper
                                        size="sm"
                                        w="100%"
                                        minH="50px"
                                        index={activeStep}
                                        gap={0}
                                    >
                                        {steps.slice(0, steps.length - 1).map((step, index) => (
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
                                        {steps[activeStep]}
                                    </Text>
                                </VStack>

                                <Divider mb={2} />

                                <VStack w="full">
                                    {activeStep === 0 && (
                                        <STLInput
                                            setImage={setSTLPreview}
                                            image={STLPreview}
                                        />
                                    )}

                                    {activeStep === 1 && (
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

                                    {activeStep === 2 && (
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
                                                                            props.setFieldValue('printerType', type);
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

                                    {activeStep === 3 && (
                                        <>
                                            <Field name="printer">
                                                {({ form, field }) => {
                                                    return (
                                                        <>
                                                            {printers
                                                                .filter((p) => p.type === form.values.printerType?.id)
                                                                .map((printer) => {
                                                                    return (
                                                                        <PrinterItem
                                                                            key={printer.id}
                                                                            printer={printer}
                                                                            onClick={() => {
                                                                                props.setFieldValue('printer', printer);
                                                                            }}
                                                                            isActive={field.value?.id === printer.id}
                                                                        />
                                                                    );
                                                                })}
                                                        </>
                                                    );
                                                }}
                                            </Field>
                                        </>
                                    )}

                                    {activeStep === 4 && (
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

                                    {activeStep === 5 && (
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
                                                                    Verify the end user has permission for this print
                                                                </AlertDescription>
                                                            </HStack>
                                                        </Alert>
                                                    ) : null}
                                                </VStack>
                                            </FormControl>
                                        </>
                                    )}

                                    {activeStep >= 6 && (
                                        <>
                                            {props.isSubmitting ? (
                                                <>
                                                    <Box
                                                        w="full"
                                                        h="auto"
                                                    >
                                                        <Spinner colorScheme="blue" />
                                                    </Box>
                                                </>
                                            ) : (
                                                <>
                                                    <Alert
                                                        status="success"
                                                        variant="subtle"
                                                        flexDirection="column"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        textAlign="center"
                                                        height="200px"
                                                    >
                                                        <AlertIcon
                                                            boxSize="40px"
                                                            mr={0}
                                                        />
                                                        <AlertTitle
                                                            mt={4}
                                                            mb={1}
                                                            fontSize="lg"
                                                        >
                                                            Print submitted
                                                        </AlertTitle>
                                                        <AlertDescription maxWidth="sm">
                                                            Maybe we can estimate when the print will be done...
                                                        </AlertDescription>
                                                    </Alert>
                                                </>
                                            )}
                                        </>
                                    )}
                                </VStack>
                            </ModalBody>
                            <ModalFooter spacing={3}>
                                {activeStep < 6 ? (
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
                                                if (activeStep === steps.length - 3) {
                                                    props.handleSubmit();
                                                }
                                                setActiveStep((s) => s + 1);
                                            }}
                                            isDisabled={activeStep >= steps.length}
                                        >
                                            Next
                                        </Button>
                                    </ButtonGroup>
                                ) : (
                                    <>
                                        <Spacer />
                                        <Button
                                            colorScheme="blue"
                                            leftIcon={<Icon as={iconSet.check} />}
                                            onClick={() => {
                                                props.handleReset();
                                                onClose();
                                                setActiveStep(0);
                                                setSTLPreview(null);
                                            }}
                                            isDisabled={props.isSubmitting}
                                        >
                                            Done
                                        </Button>
                                    </>
                                )}
                            </ModalFooter>
                        </Form>
                    </ModalContent>
                </Modal>
            )}
        </Formik>
    );
}
