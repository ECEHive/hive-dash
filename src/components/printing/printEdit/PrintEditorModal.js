import { useCallback, useEffect, useState } from 'react';

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
    Icon,
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

import ReactMarkdown from 'react-markdown';

import usePrintParser from '@/hooks/usePrintParser';
import usePrintUpdate from '@/hooks/usePrintUpdate';

import iconSet from '@/util/icons';

import {
    DangerousActions,
    Events,
    Notes,
    PrintInfo,
    PrintState,
    UserInfo
} from '@/components/printing/printEdit/EditorComponents';

export default function PrintEditorModal({ isOpen, onClose, initialData }) {
    const { betterPrintData } = usePrintParser(initialData);

    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const [printData, setPrintData] = useState(null);
    const [saving, setSaving] = useState(false);

    const { update: printUpdater, delete: printDeleter } = usePrintUpdate();

    useEffect(() => {
        setPrintData(initialData);
    }, [initialData]);

    function updatePrintData(newData) {
        console.log(newData);
        setPrintData((old) => {
            return {
                ...old,
                ...newData
            };
        });
    }

    function save() {
        setSaving(true);
        printUpdater(printData._id, printData)
            .then(() => {
                setSaving(false);
                onClose();
            })
            .catch(() => {
                setSaving(false);
            });
    }

    const pages = [
        {
            name: 'End user',
            component: (
                <UserInfo
                    printData={printData}
                    update={updatePrintData}
                />
            ),
            icon: <Icon as={iconSet.smile} />
        },
        {
            name: 'Print info',
            component: (
                <PrintInfo
                    printData={printData}
                    update={updatePrintData}
                />
            ),
            icon: <Icon as={iconSet.printer} />
        },
        {
            name: 'Events',
            component: (
                <Events
                    printData={printData}
                    update={updatePrintData}
                />
            ),
            icon: <Icon as={iconSet.calendar} />
        },
        {
            name: 'Notes',
            component: (
                <Notes
                    printData={printData}
                    update={updatePrintData}
                />
            ),
            icon: <Icon as={iconSet.note} />
        },
        {
            name: 'Print state',
            component: (
                <PrintState
                    printData={printData}
                    update={updatePrintData}
                />
            ),
            icon: <Icon as={iconSet.toggles} />
        },
        {
            name: 'Danger zone',
            component: (
                <DangerousActions
                    printData={printData}
                    update={updatePrintData}
                    onClose={onClose}
                />
            ),
            icon: <Icon as={iconSet.settings} />,
            color: 'red'
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="3xl"
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <ModalContent h="container.sm">
                <ModalHeader>Print Editor - {betterPrintData.trayName}</ModalHeader>
                <ModalBody h="100%">
                    <HStack
                        w="100%"
                        h="100%"
                        spacing={6}
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
                            pr={3}
                            pl={1}
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
                            onClick={save}
                            isLoading={saving}
                            leftIcon={<Icon as={iconSet.save} />}
                        >
                            Save
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
