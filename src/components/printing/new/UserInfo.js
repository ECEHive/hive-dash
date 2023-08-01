import { useCallback, useContext, useEffect } from 'react';

import { FormControl, FormLabel, HStack, Heading, Input, InputGroup, InputRightAddon, VStack } from '@chakra-ui/react';

import { Select as ComplexSelect } from 'chakra-react-select';

import PrintingContext from '@/contexts/printing/PrintingContext';

export default function UserInfo({ set, data, setNext }) {
    const { peerInstructors } = useContext(PrintingContext);

    const update = useCallback(
        (field, value) => {
            set((old) => {
                return {
                    ...old,
                    user: {
                        ...old.user,
                        [field]: value
                    }
                };
            });
        },
        [set]
    );

    function makeEmail() {
        if (data.user.email === '' && data.user.firstname !== '' && data.user.lastname !== '') {
            update('email', `${data.user.firstname[0].toLowerCase()}${data.user.lastname.toLowerCase()}`);
        }
    }

    const validate = useCallback(() => {
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
    }, [data, setNext]);

    useEffect(() => {
        validate();
    }, [validate]);

    return (
        <>
            <Heading
                size="lg"
                fontFamily="body"
            >
                End user info
            </Heading>

            <VStack
                w="100%"
                h="100%"
                spacing={3}
                overflow="auto"
                p={1}
            >
                <HStack
                    spacing={5}
                    w="100%"
                >
                    <FormControl>
                        <FormLabel>End user firstname</FormLabel>
                        <Input
                            type="text"
                            placeholder="George"
                            value={data.user.firstname}
                            onChange={(e) => update('firstname', e.target.value)}
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
                            type="text"
                            placeholder="gbrudell3"
                            value={data.user.email}
                            onChange={(e) => update('email', e.target.value)}
                        />
                        <InputRightAddon>@gatech.edu</InputRightAddon>
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Assisting PI</FormLabel>
                    {peerInstructors && (
                        <ComplexSelect
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999
                                })
                            }}
                            menuPlacement="auto"
                            value={{
                                label: data.user.assistingPI,
                                value: data.user.assistingPI
                            }}
                            onChange={(e) => update('assistingPI', e.value)}
                            options={peerInstructors.map((person) => ({
                                label: person.name,
                                value: person.name
                            }))}
                            selectedOptionStyle="check"
                        />
                    )}
                </FormControl>
            </VStack>
        </>
    );
}
