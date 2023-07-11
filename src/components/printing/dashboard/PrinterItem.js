import { Card, CardBody, VStack, HStack, Heading, Badge, useColorModeValue, StatNumber, StatLabel, Box, Spacer, Divider, Progress, Tooltip, Text, ButtonGroup, Button, IconButton } from "@chakra-ui/react"
import { FaWrench } from "react-icons/fa";
import { ArrowForwardIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

export default function PrinterCard({ status, k }) {

    const statuses = {
        "printing": "green",
        "idle": "yellow",
        "down": "red",
    }

    const progressColors = {
        "printing": null,
        "idle": "green",
        "failed": "red"
    }

    const buttons = {
        "printing": <>
            <IconButton colorScheme="green" w="100%">
                <CheckIcon />
            </IconButton>
            <IconButton colorScheme="red" w="100%">
                <CloseIcon />
            </IconButton>
        </>,
        "idle": <>
            <Button w="100%" variant="outline" rightIcon={<ArrowForwardIcon />}>
                Start print
            </Button>
        </>,
        "down": <>
            <Button w="100%" variant="outline" colorScheme="orange">
                Maintenance
            </Button>
            <Button w="100%" variant="outline" rightIcon={<ArrowForwardIcon />}>
                Start print
            </Button>
        </>
    }

    return (
        <Card
            variant="filled"
            borderRadius={5}
            w="100%"
            bgColor={useColorModeValue("gray.200", "gray.600")}
            flexGrow={1}
        >
            <CardBody>
                <VStack spacing={2} alignItems="flex-start" h="100%">
                    <HStack w="100%">
                        <Heading size="md" fontWeight="medium">Center Stratasys</Heading>
                        <Badge variant="subtle" colorScheme="yellow">idle</Badge>
                        <Spacer />
                        <HStack spacing={1}>
                            {/* <HiMiniQueueList /> */}
                            <Text fontSize="md" fontWeight="bold">1</Text>
                            <Text fontSize="sm">prints in queue</Text>
                        </HStack>
                    </HStack>
                    <VStack justifyContent="center" spacing={1} w="100%" h="100%">
                        <HStack w="100%">
                            <Text fontSize="md">
                                PI_Colin_Hartigan_long_print_name
                            </Text>
                            <Spacer />
                            <Badge variant="subtle">
                                complete
                            </Badge>
                        </HStack>
                        <Progress
                            value={100}
                            size="sm"
                            w="100%"
                            borderRadius={5}
                            colorScheme="green"
                        />
                    </VStack>
                </VStack>
            </CardBody>
        </Card>
    )
}