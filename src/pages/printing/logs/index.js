import {
    Badge,
    Box,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';

import GlobalLayout from '@/layouts/GlobalLayout';
import Layout from '@/layouts/PrintingLayout';

function LogItem({ printData }) {
    const { betterPrintData, printerData } = usePrintParser(printData);
    const { progressMessage, progressMessageColor } = usePrintProgress(printData);

    return (
        <Tr>
            <Td>
                <VStack
                    align="start"
                    justify="start"
                    spacing={1}
                >
                    <Text fontSize="md">{betterPrintData.trayName}</Text>
                    <Text
                        fontSize="xs"
                        color="gray.500"
                    >
                        {betterPrintData.queuedAtExtendedFormatted}
                    </Text>
                </VStack>
            </Td>
            <Td>{printerData?.displayName || betterPrintData.printer}</Td>
            <Td>
                <Badge
                    variant="subtle"
                    colorScheme={progressMessageColor}
                >
                    {progressMessage}
                </Badge>
            </Td>
            <Td>{betterPrintData.estTimeFormatted}</Td>
            <Td>{betterPrintData.queuedBy}</Td>
        </Tr>
    );
}

export default function PrintLogs(props) {
    const { queue } = usePrinting();

    const sortedQueue = [...queue].sort((a, b) => {
        return new Date(b.queuedAt) - new Date(a.queuedAt);
    });

    return (
        <>
            <Box
                w="100%"
                h="100%"
                p={5}
            >
                <VStack
                    w="100%"
                    h="100%"
                    spacing={5}
                    align="start"
                    overflow="hidden"
                >
                    <HStack w="auto">
                        <InputGroup>
                            <InputLeftElement>
                                <SearchIcon />
                            </InputLeftElement>
                            <Input placeholder="Search for a print" />
                        </InputGroup>
                    </HStack>
                    <TableContainer
                        w="100%"
                        h="auto"
                        overflowY="auto"
                    >
                        <Table
                            variant="simple"
                            size="sm"
                            overflow="auto"
                        >
                            <Thead>
                                <Tr>
                                    <Th>Print info</Th>
                                    <Th>Printer</Th>
                                    <Th>Status</Th>
                                    <Th>Est. time</Th>
                                    <Th>Queued by</Th>
                                    {/* <Th>Queued by</Th> */}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {sortedQueue.map((print) => {
                                    return (
                                        <LogItem
                                            key={print._id}
                                            printData={print}
                                        />
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </VStack>
            </Box>
        </>
    );
}

PrintLogs.getLayout = (page) => (
    <GlobalLayout>
        <Layout>{page}</Layout>
    </GlobalLayout>
);
