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

export default function UserInfo({ set, data, setNext }) {
    const PIList = useMemo(() => ['Colin Hartigan', 'Someone else'], []);

    function update(field, value) {
        set({
            ...data,
            user: {
                ...data.user,
                [field]: value
            }
        });
    }

    function makeEmail() {
        if (data.user.email === '') {
            console.log('hi');
            update('email', `${data.user.firstname[0].toLowerCase()}${data.user.lastname.toLowerCase()}`);
        }
    }

    useEffect(() => {
        if (
            data.user.firstname !== '' &&
            data.user.lastname !== '' &&
            data.user.email !== '' &&
            data.user.assistingPI !== ''
        ) {
            setNext(true);
        } else {
            setNext(false);
        }
    }, [data]);

    return (
        <>
            <Heading size="lg" fontFamily="body">
                End user info
            </Heading>

            <VStack w="100%" h="100%" spacing={3} overflow="auto" p={1}>
                <HStack spacing={5} w="100%">
                    <FormControl>
                        <FormLabel>End user firstname</FormLabel>
                        <Input
                            type="text"
                            placeholder="George"
                            value={data.user.firstname}
                            onChange={(e) =>
                                update('firstname', e.target.value)
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>End user lastname</FormLabel>
                        <Input
                            type="text"
                            placeholder="Brudell"
                            value={data.user.lastname}
                            onChange={(e) => update('lastname', e.target.value)}
                            onBlur={makeEmail}
                        />
                    </FormControl>
                </HStack>
                <FormControl>
                    <FormLabel>End user GT email</FormLabel>
                    <InputGroup>
                        <Input
                            type="email"
                            placeholder="gbrudell3"
                            value={data.user.email}
                            onChange={(e) => update('email', e.target.value)}
                        />
                        <InputRightAddon>@gatech.edu</InputRightAddon>
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Assisting PI</FormLabel>
                    <AutoComplete
                        openOnFocus
                        defaultValue={data.user.assistingPI}
                        value={data.user.assistingPI}
                        onChange={(e) => update('assistingPI', e)}
                    >
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
