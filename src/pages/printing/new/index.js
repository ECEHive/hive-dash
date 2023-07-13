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

export default function NewPrint(props) {
    
    const steps = useMemo(() => [
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
    ], []);

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length || 0
    });

    return (
        <>
            <Center w="100%" h="100%" p={5}>
                <Card
                    w="auto"
                    maxW="1200px"
                    h="auto"
                    maxH="100%"
                    borderRadius={10}
                    variant="filled"
                >
                    <CardBody w="100%" h="100%">
                        <VStack
                            h="100%"
                            w="100%"
                            spacing={5}
                            justify="flex-start"
                            align="center"
                        >
                            <Stepper size="lg" w="100%" index={activeStep} >
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
                                justifyContent="center"
                                alignItems="center"
                                spacing={5}
                            >
                                <Heading size="lg" fontFamily="body">
                                    Select a printer type
                                </Heading>

                                <HStack
                                    w="100%"
                                    h="auto"
                                    spacing={3}
                                    justify="center"
                                >
                                    <VStack
                                        spacing={3}
                                        w="auto"
                                        h="100%"
                                        justify="flex-start"
                                    >
                                        <PrinterType type="Ultimaker" />
                                        <PrinterType type="Stratasys" />
                                        <PrinterType type="Formlabs" />
                                        <PrinterType type="Markforged" />
                                    </VStack>

                                    <ChevronRightIcon boxSize={10} />

                                    <VStack
                                        spacing={3}
                                        w="auto"
                                        h="100%"
                                        justify="flex-start"
                                    >
                                        <PrinterItem />
                                    </VStack>
                                </HStack>
                            </VStack>

                            {/* <VStack
                                w="auto"
                                h="100%"
                                justifyContent="center"
                                alignItems="flex-start"
                                spacing={5}
                            >
                                <Heading size="lg" fontFamily="body">
                                    End user info
                                </Heading>

                                <VStack w="100%" h="auto" spacing={3}>
                                    <HStack spacing={5}>
                                        <FormControl>
                                            <FormLabel>
                                                End user firstname
                                            </FormLabel>
                                            <Input
                                                type="text"
                                                placeholder="George"
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>
                                                End user lastname
                                            </FormLabel>
                                            <Input
                                                type="text"
                                                placeholder="Brudell"
                                            />
                                        </FormControl>
                                    </HStack>
                                    <FormControl>
                                        <FormLabel>End user GT email</FormLabel>
                                        <InputGroup>
                                            <Input
                                                type="email"
                                                placeholder="gbrudell3"
                                            />
                                            <InputRightAddon>
                                                @gatech.edu
                                            </InputRightAddon>
                                        </InputGroup>
                                    </FormControl>
                                </VStack>
                            </VStack> */}

                            {/* forward/back control */}
                            <HStack w="100%" mt={4}>
                                <Button
                                    leftIcon={<ArrowBackIcon />}
                                    size="md"
                                    variant="solid"
                                    alignSelf="flex-end"
                                    colorScheme="blue"
                                    onClick={() => {setActiveStep(prev => prev - 1)}}
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
                                    onClick={() => {setActiveStep(prev => prev + 1)}}
                                >
                                    Next
                                </Button>
                            </HStack>
                        </VStack>
                    </CardBody>
                </Card>
            </Center>
        </>
    );
}

NewPrint.getLayout = (page) => <TopLayout>{page}</TopLayout>;
