import { useContext } from 'react';

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
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

import PrintingContext from '@/contexts/printing/PrintingContext';

import PrintingLayout from '@/layouts/printing/PrintingLayout';

import LogItem from '@/components/printing/logs/LogItem';

export default function PrintLogs(props) {
    const { queue } = useContext(PrintingContext);

    const sortedQueue = queue.sort((a, b) => {
        return new Date(b.queuedAt) - new Date(a.queuedAt);
    });

    return (
        <>
            <Box w="100%" h="100%" p={5}>
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
                    <TableContainer w="100%" h="auto" overflowY="auto">
                        <Table variant="simple" size="md" overflow="auto">
                            <Thead>
                                <Tr>
                                    <Th>Queue date</Th>
                                    <Th>Status</Th>
                                    <Th>Print name</Th>
                                    <Th>Printer</Th>
                                    <Th>Est. time</Th>
                                    {/* <Th>Queued by</Th> */}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {sortedQueue.map((print) => {
                                    return (
                                        <LogItem
                                            key={print.id}
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

PrintLogs.getLayout = (children) => <PrintingLayout>{children}</PrintingLayout>;
