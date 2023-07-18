import { stateColorLookup } from '@/util/statusColors';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CircularProgress,
    Heading,
    HStack,
    Spacer,
    Text,
    VStack
} from '@chakra-ui/react';

export default function PrinterListItem({ data, onClick, isActive }) {
    return (
        <Card w="100%" minH="115px" as={Button} p={0} variant="filled" onClick={onClick} isActive={isActive}>
            <CardBody w="100%">
                <VStack spacing={0} alignItems="flex-start" h="100%">
                    <HStack w="100%">
                        <Heading size="md" fontWeight="medium">
                            {data.displayName}
                        </Heading>
                        <Badge
                            variant="subtle"
                            colorScheme={stateColorLookup(data.status.state)}
                        >
                            {data.status.state}
                        </Badge>
                    </HStack>

                    <Spacer />

                    <HStack w="100%" justifyContent="flex-start" spacing={5}>
                        {/* <CircularProgress value={100} color="green.200" size={8} /> */}
                        <VStack alignItems="flex-start" spacing={0.5}>
                            <HStack spacing={1}>
                                <CircularProgress
                                    value={100}
                                    color="green.200"
                                    size={4}
                                    thickness={10}
                                />
                                <Text fontSize="lg" fontWeight="semibold">
                                    11:59
                                </Text>
                            </HStack>
                            <Text fontSize="sm" fontWeight="normal">
                                est. remaining
                            </Text>
                        </VStack>
                        <VStack alignItems="flex-start" spacing={0.5}>
                            <Text fontSize="lg" fontWeight="semibold">
                                X
                            </Text>
                            <Text fontSize="sm" fontWeight="normal">
                                in queue
                            </Text>
                        </VStack>
                        {/* <VStack alignItems="flex-start" spacing={0}>
                                                <Text fontSize="lg" fontWeight="semibold">ABS</Text>
                                                <Text fontSize="xs" fontWeight="normal">material</Text>
                                            </VStack> */}
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    );
}
