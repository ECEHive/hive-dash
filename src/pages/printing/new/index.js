import { useMemo, useEffect } from 'react';
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
    InputRightAddon
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

                                    <Box flexShrink="0">
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
                            w="auto"
                            h="100%"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={5}
                            p={2}
                            overflow="hidden"
                        >
                            <PrinterSelect />
                            
                            {/* <UserInfo /> */}

                            
                        </VStack>

                        {/* forward/back control */}
                        <HStack w="100%" h="auto">
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
                            <Spacer />
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
                        </HStack>
                    </VStack>
                </Box>
            </Center>
        </>
    );
}

NewPrint.getLayout = (page) => <TopLayout>{page}</TopLayout>;
