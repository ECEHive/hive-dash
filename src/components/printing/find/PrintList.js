import { useCallback, useContext, useEffect, useState } from 'react';
import {
    VStack,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    Heading,
    Badge,
    HStack,
    Spacer,
    Button,
    InputRightAddon,
    Card,
    CardBody,
    Tooltip
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';
import PrintListItem from './PrintListItem';

export default function PrintList({ selectedPrintData, setSelectedPrintData }) {
    const { printers, printerTypes, queue } = useContext(PrintingContext);

    const [searchEmail, setSearchEmail] = useState('chartigan6');
    const [matchedPrints, setMatchedPrints] = useState([]);

    const search = useCallback(() => {
        setMatchedPrints(
            queue
                .filter((print) => print.endUser.email.includes(searchEmail))
                .sort((a, b) => {
                    return dayjs.utc(b.queuedAt) - dayjs.utc(a.queuedAt);
                })
        );
    }, [queue, searchEmail]);

    useEffect(() => {
        search();
    }, []);

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
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') search();
                        }}
                    />
                    <InputRightAddon>@gatech.edu</InputRightAddon>
                </InputGroup>

                <VStack
                    w="100%"
                    alignItems="flex-start"
                    spacing={3}
                    overflow="auto"
                >
                    {matchedPrints.map((print) => {
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
                    })}
                </VStack>
            </VStack>
        </>
    );
}
