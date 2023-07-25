import { useContext, useEffect, useMemo, useState } from 'react';

import {
    Badge,
    Button,
    Card,
    CardBody,
    Code,
    HStack,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    List,
    ListItem,
    Spacer,
    Text,
    Tooltip,
    UnorderedList,
    VStack
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

import PrintListItem from './PrintListItem';

export default function PrintList({ selectedPrintData, setSelectedPrintData }) {
    const { printers, printerTypes, queue } = useContext(PrintingContext);

    const [searchTerm, setSearchTerm] = useState('ch');

    const matchedPrints = useMemo(() => {
        if (searchTerm.length > 0) {
            return queue
                .filter(
                    (print) =>
                        print.endUser.email.toLowerCase().includes(searchTerm) ||
                        (print.endUser.firstname || '').toLowerCase().includes(searchTerm) ||
                        (print.endUser.lastname || '').toLowerCase().includes(searchTerm) ||
                        print.trayName.toLowerCase().includes(searchTerm) ||
                        dayjs(print.queuedAt).local().format('MM/DD/YYYY').includes(searchTerm)
                )
                .sort((a, b) => {
                    return dayjs.utc(b.queuedAt) - dayjs.utc(a.queuedAt);
                });
        } else {
            return [];
        }
    }, [queue, searchTerm]);

    return (
        <>
            <VStack
                w="400px"
                h="100%"
                spacing={3}
                alignItems="flex-start"
                justifyContent="flex-start"
            >
                <InputGroup w="100%">
                    <InputLeftElement>
                        <SearchIcon />
                    </InputLeftElement>
                    <Input
                        placeholder="Search for a print"
                        type="text"
                        //onBlur={search}
                        // value={searchEmail}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        // onKeyDown={(e) => {
                        //     if (e.key === 'Enter') search();
                        // }}
                    />
                </InputGroup>

                <VStack
                    w="100%"
                    alignItems="flex-start"
                    spacing={3}
                    overflow="auto"
                    pt={3}
                >
                    {matchedPrints.length > 0 ? (
                        matchedPrints.map((print) => {
                            return (
                                <PrintListItem
                                    key={print._id}
                                    data={print}
                                    onClick={() => {
                                        setSelectedPrintData(print);
                                    }}
                                    isActive={selectedPrintData?._id === print._id}
                                />
                            );
                        })
                    ) : (
                        <VStack
                            align="start"
                            px={3}
                        >
                            <Text fontSize="lg">Search for a print using any of the following fields:</Text>
                            <UnorderedList>
                                <ListItem>Your @gatech.edu email</ListItem>
                                <ListItem>The print&apos;s name</ListItem>
                                <ListItem>
                                    The date you queued it (in&nbsp;
                                    <Code>MM/DD/YYYY</Code>&nbsp;format)
                                </ListItem>
                            </UnorderedList>
                        </VStack>
                    )}
                </VStack>
            </VStack>
        </>
    );
}
