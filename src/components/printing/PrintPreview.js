import {
    Badge,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    HStack,
    Progress,
    Spacer,
    Text,
    VStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

export default function PrintPreview({ actions }) {
    return (
        <Card
            w="100%"
            h="auto"
            variant="filled"
            bgColor={useColorModeValue('gray.200', 'gray.600')}
        >
            <CardBody>
                <HStack w="100%" spacing={5}>
                    <VStack w="100%" spacing={4}>
                        <VStack w="100%" spacing={1}>
                            <HStack w="100%">
                                <VStack
                                    alignItems="flex-start"
                                    h="100%"
                                    w="100%"
                                    spacing={0}
                                >
                                    <Text fontSize="lg" fontWeight="medium">
                                        PI_Colin_Hartigan_long_print_name
                                    </Text>
                                    <Text fontSize="sm">
                                        Queued by: firstname lastname
                                    </Text>
                                </VStack>
                                <Spacer />
                                <Badge variant="subtle" alignSelf="flex-end">
                                    waiting for confirmation
                                </Badge>
                            </HStack>
                            <Progress
                                w="100%"
                                value={100}
                                size="sm"
                                borderRadius={5}
                                colorScheme="green"
                            />
                        </VStack>

                        <HStack
                            justifyContent="flex-start"
                            alignItems="flex-end"
                            w="100%"
                            spacing={6}
                        >
                            <VStack alignItems="flex-start" spacing={0}>
                                <Text
                                    fontSize="3xl"
                                    fontWeight="semibold"
                                    lineHeight={1}
                                >
                                    11:59
                                </Text>
                                <Text fontSize="md" fontWeight="normal">
                                    est. print time
                                </Text>
                            </VStack>
                            <VStack alignItems="flex-start" spacing={0}>
                                <HStack spacing={1}>
                                    <Text
                                        fontSize="3xl"
                                        fontWeight="semibold"
                                        lineHeight={1}
                                    >
                                        13
                                    </Text>
                                    <Text fontSize="sm" alignSelf="flex-end">
                                        in^3
                                    </Text>
                                </HStack>
                                <Text fontSize="md" fontWeight="normal">
                                    est. material
                                </Text>
                            </VStack>
                            <VStack alignItems="flex-start" spacing={0}>
                                <Text
                                    fontSize="3xl"
                                    fontWeight="semibold"
                                    lineHeight={1}
                                >
                                    ABS
                                </Text>
                                <Text fontSize="md" fontWeight="normal">
                                    material type
                                </Text>
                            </VStack>

                            <Spacer />

                            {actions}
                        </HStack>
                    </VStack>
                </HStack>
            </CardBody>
        </Card>
    );
}
