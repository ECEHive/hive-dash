import { useMemo, useState, useEffect } from 'react';
import {
    Heading,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon
} from '@chakra-ui/react';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList
} from '@choc-ui/chakra-autocomplete';

export default function UserInfo(props) {

    const PIList = useMemo(() => ['Colin Hartigan', 'Someone else'], []);

    return (
        <>
            <Heading size="lg" fontFamily="body">
                End user info
            </Heading>

            <VStack w="100%" h="100%" spacing={3} overflow="auto" p={2}>
                <HStack spacing={5} w="100%">
                    <FormControl>
                        <FormLabel>End user firstname</FormLabel>
                        <Input type="text" placeholder="George" />
                    </FormControl>
                    <FormControl>
                        <FormLabel>End user lastname</FormLabel>
                        <Input type="text" placeholder="Brudell" />
                    </FormControl>
                </HStack>
                <FormControl>
                    <FormLabel>End user GT email</FormLabel>
                    <InputGroup>
                        <Input type="email" placeholder="gbrudell3" />
                        <InputRightAddon>@gatech.edu</InputRightAddon>
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Assisting PI</FormLabel>
                    <AutoComplete openOnFocus>
                        <AutoCompleteInput />
                        <AutoCompleteList>
                            {PIList.map((person, idx) => (
                                <AutoCompleteItem
                                    key={`PI-${idx}`}
                                    value={person}
                                >
                                    {person}
                                </AutoCompleteItem>
                            ))}
                        </AutoCompleteList>
                    </AutoComplete>
                </FormControl>
            </VStack>
        </>
    );
}
