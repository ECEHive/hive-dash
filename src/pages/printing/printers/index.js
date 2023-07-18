import { useState, useContext } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    VStack,
    HStack,
    Heading,
    Badge,
    Spacer,
    Text,
    CircularProgress,
    ButtonGroup,
    IconButton,
    useColorModeValue,
    Progress,
    Flex,
    Tooltip,
    Input,
    InputGroup,
    InputLeftElement,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { FaPlay, FaWrench, FaPencilAlt } from 'react-icons/fa';

import InfoCard from '@/components/printing/printers/InfoCard';
import TopLayout from '@/layouts/printing/PrintingLayout';
import PrintPreview from '@/components/printing/PrintPreview';

import PrintingContext from '@/contexts/PrintingContext';
import PrinterList from '@/components/printing/printers/PrinterList';
import QueueTable from '@/components/printing/printers/QueueTable';

export default function Printers(props) {
    const { printers, queue, printerTypes } = useContext(PrintingContext);

    const [selectedPrinterId, setselectedPrinterId] = useState(null);

    return (
        <>
            <Box w="100%" h="100%" overflow="auto" p={5}>
                <HStack
                    w="100%"
                    h="100%"
                    spacing={4}
                    alignItems="flex-start"
                    justifyContent="flex-start"
                >
                    <PrinterList
                        selectedPrinterId={selectedPrinterId}
                        setselectedPrinterId={setselectedPrinterId}
                    />

                    <Card
                        h="100%"
                        flexGrow={1}
                        variant="filled"
                        borderRadius={10}
                    >
                        <CardBody>
                            <HStack w="100%" mb={4} alignItems="center">
                                <Heading size="lg">Center Stratasys</Heading>
                                <Spacer />
                                <IconButton
                                    icon={<FaWrench />}
                                    colorScheme="orange"
                                    isDisabled
                                />
                            </HStack>
                            <VStack
                                alignItems="flex-start"
                                h="auto"
                                w="100%"
                                spacing={4}
                                overflow="auto"
                            >
                                {/* current print */}
                                <PrintPreview
                                    actions={
                                        <ButtonGroup
                                            isAttached
                                            variant="outline"
                                            size="md"
                                        >
                                            <Button
                                                colorScheme="red"
                                                leftIcon={<CloseIcon />}
                                            >
                                                Failed
                                            </Button>
                                            <Button
                                                colorScheme="green"
                                                leftIcon={<CheckIcon />}
                                            >
                                                Completed
                                            </Button>
                                        </ButtonGroup>
                                    }
                                />

                                {/* queue */}
                                <QueueTable selectedPrinterId={selectedPrinterId}/>
                            </VStack>
                        </CardBody>
                    </Card>
                </HStack>
            </Box>
        </>
    );
}

Printers.getLayout = (page) => <TopLayout>{page}</TopLayout>;
