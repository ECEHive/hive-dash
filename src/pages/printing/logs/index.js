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

export default function PrintLogs(props) {
    const { queue } = useContext(PrintingContext);

    return (
        <>
            <Box w="100%" h="100%" p={5}>
                <VStack w="100%" spacing={5} align="start">
                    <HStack w="auto">
                        <InputGroup>
                            <InputLeftElement>
                                <SearchIcon />
                            </InputLeftElement>
                            <Input placeholder="Search for a print" />
                        </InputGroup>
                    </HStack>
                    <TableContainer w="100%">
                        <Table variant="simple" size="sm">
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
                                <Tr>
                                    <Td>9/23/2023 11:52 am</Td>
                                    <Td>
                                        <Badge
                                            variant="subtle"
                                            colorScheme="green"
                                        >
                                            printing
                                        </Badge>
                                    </Td>
                                    <Td>Test print</Td>
                                    <Td>Left Stratasys</Td>
                                    <Td>1:30</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </VStack>
            </Box>
        </>
    );
}

PrintLogs.getLayout = (children) => <PrintingLayout>{children}</PrintingLayout>;
