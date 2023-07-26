import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    Select,
    Switch,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
    VStack,
    chakra,
    useColorModeValue
} from '@chakra-ui/react';

import { DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';

import Editor from '@monaco-editor/react';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';

import usePrintEvents from '@/hooks/usePrintEvents';

import { PrintStates, StateColors } from '@/util/states';

const ChakraEditor = chakra(Editor);

function SectionHeader({ children }) {
    return (
        <Heading
            size="lg"
            fontFamily="body"
        >
            {children}
        </Heading>
    );
}

function Section({ children }) {
    return (
        <VStack
            align="start"
            spacing={3}
        >
            {children}
        </VStack>
    );
}

function ThColored({ children }) {
    return <Th borderColor="gray.600">{children}</Th>;
}

function TdColored({ children }) {
    return <Td borderColor="gray.600">{children}</Td>;
}

function PrintState({}) {
    return (
        <VStack
            align="start"
            spacing={3}
            maxW="full"
        >
            <SectionHeader>Print state</SectionHeader>

            {/* <HStack
                w="full"
                spacing={3}
                align="start"
            > */}
            <FormControl>
                <FormLabel>State</FormLabel>
                <InputGroup>
                    <ButtonGroup
                        orientation="horizontal"
                        isAttached
                        variant="outline"
                    >
                        {Object.keys(PrintStates).map((state) => {
                            let val = PrintStates[state];
                            return (
                                <Button
                                    //colorScheme={StateColors[val]}
                                    key={state}
                                >
                                    {state}
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                </InputGroup>
                <FormHelperText>
                    Change the print&apos;s state. This will not add an entry to the print&apos;s events history.
                </FormHelperText>
            </FormControl>
            {/* </HStack> */}
        </VStack>
    );
}

function UserInfo({}) {
    return (
        <VStack
            align="start"
            spacing={3}
            maxW="460px"
        >
            <SectionHeader>End user info</SectionHeader>
            <HStack spacing={3}>
                <FormControl>
                    <FormLabel>First name</FormLabel>
                    <InputGroup>
                        <Input />
                    </InputGroup>
                </FormControl>

                <FormControl>
                    <FormLabel>Last name</FormLabel>
                    <InputGroup>
                        <Input />
                    </InputGroup>
                </FormControl>
            </HStack>
            <FormControl>
                <FormLabel>GT email</FormLabel>
                <InputGroup>
                    <Input />
                    <InputRightAddon>@gatech.edu</InputRightAddon>
                </InputGroup>
            </FormControl>
        </VStack>
    );
}

function PrintInfo({}) {
    return (
        <VStack
            align="start"
            spacing={3}
        >
            <SectionHeader>Print info</SectionHeader>
            <FormControl>
                <FormLabel>Print name</FormLabel>
                <InputGroup>
                    <Input />
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel>Queued by</FormLabel>
                <InputGroup>
                    <Input placeholder="PI name" />
                </InputGroup>
                <FormHelperText>make this an autocomplete @colin</FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel>Printer</FormLabel>
                <InputGroup>
                    <Select>
                        <option>Ultimaker 1</option>
                    </Select>
                </InputGroup>
                <FormHelperText>i feel like some helper text will be useful here</FormHelperText>
            </FormControl>
            <HStack spacing={3}>
                <FormControl>
                    <FormLabel>Material type</FormLabel>
                    <InputGroup>
                        <Select>
                            <option>ABS</option>
                            <option>PLA</option>
                            <option>resin</option>
                        </Select>
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Material usage</FormLabel>
                    <InputGroup>
                        <Input />
                        <InputRightAddon>unit</InputRightAddon>
                    </InputGroup>
                </FormControl>
            </HStack>
            <FormControl>
                <FormLabel>Estimated time</FormLabel>
                <InputGroup>
                    <Input />
                </InputGroup>
                <FormHelperText>format is HH:MM</FormHelperText>
            </FormControl>
        </VStack>
    );
}

function Events({ printData }) {
    const { detailedEvents } = usePrintEvents(printData);

    return (
        <VStack
            align="start"
            spacing={3}
            w="460px"
        >
            <SectionHeader>Events</SectionHeader>

            <TableContainer w="full">
                <Table>
                    <Thead>
                        <ThColored>Event (newest first)</ThColored>
                        <ThColored>Actions</ThColored>
                    </Thead>
                    <Tbody>
                        {detailedEvents.map((event) => {
                            return (
                                <Tr key={event.timestamp}>
                                    <TdColored borderColor="gray.400">
                                        <HStack
                                            justify="start"
                                            spacing={3}
                                        >
                                            {event.icon}

                                            <VStack
                                                align="start"
                                                spacing={1}
                                            >
                                                <Text
                                                    lineHeight={1}
                                                    fontSize="md"
                                                >
                                                    {event.description}
                                                </Text>
                                                <Text fontSize="xs">{event.formattedTimestamp}</Text>
                                            </VStack>
                                        </HStack>
                                    </TdColored>
                                    <TdColored>
                                        <ButtonGroup size="sm">
                                            <Button rightIcon={<ExternalLinkIcon />}>Edit notes</Button>
                                            <IconButton colorScheme="red">
                                                <DeleteIcon />
                                            </IconButton>
                                        </ButtonGroup>
                                    </TdColored>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </VStack>
    );
}

function Notes({ betterPrintData }) {
    return (
        <VStack
            align="start"
            spacing={3}
            maxW="460px"
            h="500px"
        >
            <SectionHeader>Print notes</SectionHeader>
            <FormControl
                h="full"
                flexGrow={1}
                display="flex"
                flexDir="column"
            >
                <FormLabel>Notes</FormLabel>
                <InputGroup flexGrow={1}>
                    <Textarea h="full" />
                </InputGroup>
                <FormHelperText>
                    Info about the print (i.e. reason for cancellation, etc). Markdown is supported.
                </FormHelperText>
            </FormControl>

            <Card
                variant="outline"
                bgColor="transparent"
                w="full"
                h="full"
            >
                <CardBody
                    overflow="auto"
                    h="full"
                >
                    <ReactMarkdown
                        components={ChakraUIRenderer()}
                        skipHtml
                    >
                        {betterPrintData.notes}
                    </ReactMarkdown>
                </CardBody>
            </Card>
        </VStack>
    );
}

function DangerousActions({}) {
    return (
        <VStack
            align="start"
            spacing={3}
        >
            <SectionHeader>Dangerous actions</SectionHeader>

            <FormControl>
                <FormLabel>Actions</FormLabel>
                <ButtonGroup>
                    <Button colorScheme="red">Delete print</Button>
                </ButtonGroup>
            </FormControl>
            <FormControl>
                <FormLabel>Manually edit print JSON</FormLabel>
                <InputGroup>
                    <ChakraEditor
                        height="300px"
                        width="100%"
                        language="json"
                        theme={useColorModeValue('vs-light', 'vs-dark')}
                        options={{}}
                        value={null}
                        onChange={null}
                    />
                </InputGroup>
                <FormHelperText>
                    Editing this is dangerous and should probably only be done as a last resort. Only edit this if you
                    know what you&apos;re doing.
                </FormHelperText>
            </FormControl>
        </VStack>
    );
}

export { PrintState, UserInfo, PrintInfo, Events, Notes, DangerousActions };
