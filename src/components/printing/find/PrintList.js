import { useCallback, useContext, useEffect, useState } from 'react';

import {
    Badge,
    Button,
    Card,
    CardBody,
    HStack,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    Spacer,
    Text,
    Tooltip,
    VStack
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

import PrintListItem from './PrintListItem';

export default function PrintList({ selectedPrintData, setSelectedPrintData }) {
    const { printers, printerTypes, queue } = useContext(PrintingContext);

    const [matchedPrints, setMatchedPrints] = useState([]);

    const search = useCallback(
        (searchEmail) => {
            if (searchEmail.length > 0) {
                setMatchedPrints(
                    queue
                        .filter((print) =>
                            print.endUser.email.includes(searchEmail)
                        )
                        .sort((a, b) => {
                            return (
                                dayjs.utc(b.queuedAt) - dayjs.utc(a.queuedAt)
                            );
                        })
                );
            } else {
                setMatchedPrints([]);
            }
        },
        [queue]
    );

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
                        placeholder="GT email"
                        type="text"
                        //onBlur={search}
                        // value={searchEmail}
                        onChange={(e) => search(e.target.value)}
                        // onKeyDown={(e) => {
                        //     if (e.key === 'Enter') search();
                        // }}
                    />
                    <InputRightAddon>@gatech.edu</InputRightAddon>
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
                                    isActive={
                                        selectedPrintData?._id === print._id
                                    }
                                />
                            );
                        })
                    ) : (
                        <Text fontSize="xl">Search for a print!</Text>
                    )}
                </VStack>
            </VStack>
        </>
    );
}
