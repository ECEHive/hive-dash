import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Center,
    HStack,
    Spacer,
    Spinner,
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    VStack,
    useSteps,
    useToast
} from '@chakra-ui/react';

import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

import dayjs from '@/lib/time';

import usePrinting from '@/contexts/printing/PrintingContext';

import { PrintStates } from '@/util/states';

import GlobalLayout from '@/layouts/GlobalLayout';
import Layout from '@/layouts/printing/PrintingLayout';

import PrintInfo from '@/components/printing/new/PrintInfo';
import PrinterSelect from '@/components/printing/new/PrinterSelect';
import UserInfo from '@/components/printing/new/UserInfo';

export default function NewPrint(props) {
    const { refreshDynamicData } = usePrinting();
    const toast = useToast();

    const [inputData, setInputData] = useState({
        printer: {
            type: '',
            name: '',
            id: ''
        },
        print: {
            name: '',
            time: '',
            material: '',
            materialUsage: ''
        },
        user: {
            firstname: '',
            lastname: '',
            email: '',
            assistingPI: ''
        }
    });
    const [enableNext, setEnableNext] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [queuePos, setQueuePos] = useState(0);

    const steps = useMemo(
        () => [
            {
                title: 'Printer',
                description: inputData.printer.name
            },
            {
                title: 'Print info'
            },
            {
                title: 'End user info'
            }
        ],
        [inputData]
    );

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length || 0
    });

    useEffect(() => {
        console.log(inputData);
    }, [inputData]);

    const submit = useCallback(() => {
        let timestamp = dayjs.utc();
        let duration = dayjs
            .duration({
                hours: inputData.print.time.split(':')[0],
                minutes: inputData.print.time.split(':')[1]
            })
            .toISOString();
        const payload = {
            trayName: inputData.print.name,
            printer: inputData.printer.id,
            estTime: duration,
            materialType: inputData.print.material,
            materialUsage: inputData.print.materialUsage,
            queuedBy: inputData.user.assistingPI,
            queuedAt: timestamp,
            notes: '',
            state: PrintStates.QUEUED,
            endUser: {
                firstname: inputData.user.firstname,
                lastname: inputData.user.lastname,
                email: inputData.user.email
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
                setQueuePos(res.queueLength);
                refreshDynamicData();
                setSubmitting(false);
            })
            .catch((err) => {
                toast({
                    title: 'Error',
                    description: `Couldn't queue the print: ${err.message}`,
                    status: 'error',
                    duration: 5000
                });
            });
    }, [inputData, toast, refreshDynamicData]);

    useEffect(() => {
        if (activeStep === 3) {
            setSubmitting(true);
            submit();
        }
    }, [activeStep, submit]);

    useEffect(() => {
        setEnableNext(false);
    }, [activeStep]);

    return (
        <>
            <Center
                w="100%"
                h="100%"
                p={5}
            >
                <Box
                    w="full"
                    h="100%"
                >
                    <VStack
                        h="100%"
                        w="100%"
                        spacing={5}
                        justify="flex-start"
                        align="center"
                    >
                        <Stepper
                            size="lg"
                            w="100%"
                            minH="50px"
                            index={activeStep}
                        >
                            {steps.map((step, index) => (
                                <Step key={index}>
                                    <StepIndicator>
                                        <StepStatus
                                            complete={<StepIcon />}
                                            incomplete={<StepNumber />}
                                            active={<StepNumber />}
                                        />
                                    </StepIndicator>

                                    <Box flexShrink={0}>
                                        <StepTitle>{step.title}</StepTitle>
                                        <StepDescription>{step.description}</StepDescription>
                                    </Box>

                                    <StepSeparator />
                                </Step>
                            ))}
                        </Stepper>

                        <VStack
                            w="680px"
                            h="100%"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={3}
                            overflow="hidden"
                        >
                            {activeStep === 0 && (
                                <PrinterSelect
                                    set={setInputData}
                                    data={inputData}
                                    setNext={setEnableNext}
                                />
                            )}
                            {activeStep === 1 && (
                                <PrintInfo
                                    set={setInputData}
                                    data={inputData}
                                    setNext={setEnableNext}
                                />
                            )}
                            {activeStep === 2 && (
                                <UserInfo
                                    set={setInputData}
                                    data={inputData}
                                    setNext={setEnableNext}
                                />
                            )}
                            {activeStep === 3 && (
                                <>
                                    <VStack
                                        w="100%"
                                        h="100%"
                                        justify="center"
                                        align="center"
                                    >
                                        {submitting ? (
                                            <Spinner size="xl" />
                                        ) : (
                                            <Alert
                                                status="success"
                                                variant="subtle"
                                                flexDirection="column"
                                                alignItems="center"
                                                justifyContent="center"
                                                textAlign="center"
                                                height="auto"
                                                padding={10}
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
                                                    Position in queue: {queuePos}
                                                </AlertDescription>
                                                <AlertDescription maxWidth="sm">
                                                    The end user can check the status of their print on this website
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </VStack>
                                </>
                            )}
                        </VStack>

                        {/* forward/back control */}
                        <HStack
                            w="100%"
                            h="auto"
                        >
                            {activeStep !== 0 && activeStep !== steps.length && (
                                <Button
                                    leftIcon={<ArrowBackIcon />}
                                    size="md"
                                    variant="solid"
                                    alignSelf="flex-end"
                                    colorScheme="blue"
                                    onClick={() => {
                                        setActiveStep((prev) => prev - 1);
                                    }}
                                >
                                    Previous
                                </Button>
                            )}
                            <Spacer />
                            {activeStep !== steps.length && (
                                <Button
                                    rightIcon={<ArrowForwardIcon />}
                                    size="md"
                                    variant="solid"
                                    alignSelf="flex-end"
                                    colorScheme="blue"
                                    isDisabled={!enableNext}
                                    onClick={() => {
                                        setActiveStep((prev) => prev + 1);
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                        </HStack>
                    </VStack>
                </Box>
            </Center>
        </>
    );
}

NewPrint.getLayout = (page) => (
    <GlobalLayout>
        <Layout>{page}</Layout>
    </GlobalLayout>
);
