import { useState } from 'react';

import {
    Button,
    ButtonGroup,
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
    VStack
} from '@chakra-ui/react';

import iconSet from '@/util/icons';

export default function NewPrintModal({ open, onClose }) {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
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
                    </VStack>
                </ModalBody>
                <ModalFooter spacing={3}>
                    <ButtonGroup w="full">
                        <Button
                            colorScheme="blue"
                            leftIcon={<Icon as={iconSet.leftArrow} />}
                        >
                            Previous
                        </Button>
                        <Spacer />
                        <Button
                            colorScheme="blue"
                            rightIcon={<Icon as={iconSet.rightArrow} />}
                        >
                            Next
                        </Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
