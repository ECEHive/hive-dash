import { useCallback, useEffect, useState } from 'react';
import { AiFillPrinter, AiFillSetting } from 'react-icons/ai';
import { BsCalendarFill, BsPerson, BsPersonFill } from 'react-icons/bs';
import { FaNoteSticky } from 'react-icons/fa6';
import ReactMarkdown from 'react-markdown';

import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
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
    VStack
} from '@chakra-ui/react';

import { DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

import usePrintParser from '@/hooks/usePrintParser';
import usePrinterUpdate from '@/hooks/usePrinterUpdate';

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

export default function PrintEditorModal({ isOpen, onClose, printData }) {
    const { expandedPrintData } = usePrintParser(printData);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="6xl"
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <ModalContent h="container.sm">
                <ModalHeader>Print Editor - {expandedPrintData.trayName}</ModalHeader>
                <ModalBody h="100%">
                    <HStack
                        w="100%"
                        h="100%"
                        spacing={10}
                    >
                        <VStack
                            w="175px"
                            h="100%"
                            spacing={1}
                            justify="start"
                            align="start"
                        >
                            <ButtonGroup
                                orientation="vertical"
                                w="175px"
                            >
                                <Button
                                    w="100%"
                                    variant="ghost"
                                    justifyContent="flex-start"
                                    isActive
                                    leftIcon={<BsPersonFill />}
                                >
                                    End user
                                </Button>
                                <Button
                                    w="100%"
                                    variant="ghost"
                                    justifyContent="flex-start"
                                    leftIcon={<AiFillPrinter />}
                                >
                                    Print info
                                </Button>
                                <Button
                                    w="100%"
                                    variant="ghost"
                                    justifyContent="flex-start"
                                    leftIcon={<BsCalendarFill />}
                                >
                                    Events
                                </Button>
                                <Button
                                    w="100%"
                                    variant="ghost"
                                    justifyContent="flex-start"
                                    leftIcon={<FaNoteSticky />}
                                >
                                    Notes
                                </Button>
                                <Button
                                    w="100%"
                                    variant="ghost"
                                    justifyContent="flex-start"
                                    leftIcon={<AiFillSetting />}
                                    colorScheme="red"
                                >
                                    Actions
                                </Button>
                            </ButtonGroup>
                        </VStack>
                        <VStack
                            w="100%"
                            h="100%"
                            align="start"
                            justify="start"
                            spacing={8}
                            overflow="auto"
                            px={1}
                        >
                            <Section>
                                <SectionHeader>End user info</SectionHeader>
                                <HStack spacing={6}>
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
                            </Section>

                            <Section align="start">
                                <SectionHeader>Print info</SectionHeader>
                                <FormControl>
                                    <FormLabel>Print name</FormLabel>
                                    <InputGroup>
                                        <Input />
                                    </InputGroup>
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
                            </Section>

                            <Section align="start">
                                <SectionHeader>Events</SectionHeader>

                                <TableContainer>
                                    <Table>
                                        <Thead>
                                            <ThColored>Event</ThColored>
                                            <ThColored>Notes</ThColored>
                                            <ThColored>Actions</ThColored>
                                        </Thead>
                                        <Tbody>
                                            {expandedPrintData.detailedEvents.map((event) => {
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
                                                                    <Text fontSize="xs">
                                                                        {event.formattedTimestamp}
                                                                    </Text>
                                                                </VStack>
                                                            </HStack>
                                                        </TdColored>
                                                        <TdColored>
                                                            <Button
                                                                size="sm"
                                                                rightIcon={<ExternalLinkIcon />}
                                                            >
                                                                Edit notes
                                                            </Button>
                                                        </TdColored>
                                                        <TdColored>
                                                            <ButtonGroup size="sm">
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
                            </Section>
                        </VStack>
                    </HStack>
                </ModalBody>
                <ModalFooter spacing={3}>
                    <HStack spacing={3}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            colorScheme="blue"
                            onClick={null}
                            isLoading={false}
                        >
                            Save
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
