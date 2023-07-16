import { useMemo, useEffect, useState } from 'react';
import {
    Box,
    useSteps,
    Stepper,
    Step,
    StepIndicator,
    StepTitle,
    StepDescription,
    StepSeparator,
    StepIcon,
    StepNumber,
    StepStatus,
    VStack,
    Heading,
    SimpleGrid,
    Card,
    CardBody,
    Button,
    HStack,
    Text,
    Spacer,
    IconButton,
    Center,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
    CircularProgress
} from '@chakra-ui/react';

import TopLayout from '@/layouts/printing/PrintingLayout';
import PrinterType from '@/components/printing/new/PrinterType';
import {
    ArrowBackIcon,
    ArrowForwardIcon,
    ArrowLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@chakra-ui/icons';

import PrinterItem from '@/components/printing/new/PrinterItem';
import PrinterSelect from '@/components/printing/new/PrinterSelect';
import UserInfo from '@/components/printing/new/UserInfo';
import PrintInfo from '@/components/printing/new/PrintInfo';

export default function NewPrint(props) {
    const steps = useMemo(
        () => [
            {
                title: 'Printer',
                description: 'Ultimaker 2'
            },
            {
                title: 'Print info'
            },
            {
                title: 'End user info'
            }
        ],
        []
    );

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length || 0
    });

    const [inputData, setInputData] = useState({
        printer: {
            type: '',
            name: ''
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

    return (
        <>
            <Center w="100%" h="100%" p={5}>
                <Box w="full" h="100%">
                    <VStack
                        h="100%"
                        w="100%"
                        spacing={5}
                        justify="flex-start"
                        align="center"
                    >
                        <Stepper size="lg" w="100%" index={activeStep}>
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
                                        <StepDescription>
                                            {step.description}
                                        </StepDescription>
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
                            {activeStep === 0 && <PrinterSelect />}
                            {activeStep === 1 && <PrintInfo />}
                            {activeStep === 2 && <UserInfo />}
                            {activeStep === 3 && (
                                <>
                                    <VStack
                                        w="100%"
                                        h="100%"
                                        justify="center"
                                        align="center"
                                    >
                                        <CircularProgress
                                            isIndeterminate
                                            color="yellow.300"
                                        />
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
                                            <AlertIcon boxSize="40px" mr={0} />
                                            <AlertTitle
                                                mt={4}
                                                mb={1}
                                                fontSize="lg"
                                            >
                                                Print submitted
                                            </AlertTitle>
                                            <AlertDescription maxWidth="sm">
                                                Position in queue: 5
                                            </AlertDescription>
                                            {/* <AlertDescription maxWidth="sm">
                                                The end user can check the
                                                status of their print on this
                                                website
                                            </AlertDescription> */}
                                        </Alert>
                                    </VStack>
                                </>
                            )}
                        </VStack>

                        {/* forward/back control */}
                        <HStack w="100%" h="auto">
                            {activeStep !== 0 &&
                                activeStep !== steps.length && (
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

NewPrint.getLayout = (page) => <TopLayout>{page}</TopLayout>;
