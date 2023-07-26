import { useCallback, useEffect, useState } from 'react';
import { AiFillPrinter, AiFillSetting } from 'react-icons/ai';
import { BsCalendarFill, BsPerson, BsPersonFill, BsToggles } from 'react-icons/bs';
import { FaNoteSticky } from 'react-icons/fa6';
import ReactMarkdown from 'react-markdown';

import {
    Alert,
    AlertDescription,
    AlertIcon,
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

import usePrintParser from '@/hooks/usePrintParser';
import usePrinterUpdate from '@/hooks/usePrinterUpdate';

import {
    DangerousActions,
    Events,
    Notes,
    PrintInfo,
    PrintStates,
    UserInfo
} from '@/components/printing/printEdit/EditorComponents';

export default function PrintEditorModal({ isOpen, onClose, printData }) {
    const { expandedPrintData } = usePrintParser(printData);

    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const pages = [
        {
            name: 'Print states',
            component: <PrintStates />,
            icon: <BsToggles />
        },
        {
            name: 'End user',
            component: <UserInfo />,
            icon: <BsPersonFill />
        },
        {
            name: 'Print info',
            component: <PrintInfo />,
            icon: <AiFillPrinter />
        },
        {
            name: 'Events',
            component: <Events expandedPrintData={expandedPrintData} />,
            icon: <BsCalendarFill />
        },
        {
            name: 'Notes',
            component: <Notes expandedPrintData={expandedPrintData} />,
            icon: <FaNoteSticky />
        },
        {
            name: 'Actions',
            component: <DangerousActions />,
            icon: <AiFillSetting />,
            color: 'red'
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="4xl"
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
                        {/* navigation */}
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
                                {pages.map((page, index) => (
                                    <Button
                                        key={index}
                                        w="100%"
                                        variant="ghost"
                                        justifyContent="flex-start"
                                        isActive={currentPageIndex === index}
                                        leftIcon={page.icon}
                                        colorScheme={page.color || 'gray'}
                                        onClick={() => setCurrentPageIndex(index)}
                                    >
                                        {page.name}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </VStack>

                        {/* contnet */}
                        <VStack
                            w="100%"
                            h="100%"
                            align="start"
                            justify="start"
                            spacing={8}
                            overflow="auto"
                            px={1}
                        >
                            {pages[currentPageIndex].component}
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
