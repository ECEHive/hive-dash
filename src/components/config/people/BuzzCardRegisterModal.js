import { useState } from 'react';

import {
    ButtonGroup,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    VStack
} from '@chakra-ui/react';

import { sha256 } from 'js-sha256';

import useRequest from '@/hooks/useRequest';

import iconSet from '@/util/icons';

export default function BuzzCardRegisterModal({ user, isOpen, onClose }) {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const request = useRequest();

    function submit(result) {
        setIsLoading(true);
        if (result && result.includes('903')) {
            const gtid = result.split('=')[1];

            const hash = sha256(gtid);
            const email = `${hash}@hive.com`;
            const password = hash;

            request('/api/auth/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    mongoId: user._id
                })
            })
                .then((data) => {
                    console.log(data);
                    setIsLoading(false);
                    onClose();
                })
                .catch((err) => {
                    setIsLoading(false);
                    onClose();
                });
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            size="md"
            isCentered
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Registering {user.name}&apos;s BuzzCard</ModalHeader>
                <ModalBody>
                    {!isLoading ? (
                        <VStack
                            align="center"
                            justify="center"
                            w="full"
                            fontSize="3xl"
                        >
                            <Icon as={iconSet.buzzCard} />
                            <Text fontWeight="bold">Present BuzzCard</Text>
                            <Input
                                placeholder="BuzzCard Number"
                                position="absolute"
                                variant="unstyled"
                                top={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        console.log(input);
                                        submit(input);
                                    }
                                }}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                }}
                                onBlur={() => {
                                    onClose();
                                }}
                                w={0}
                            />
                        </VStack>
                    ) : (
                        <VStack
                            w="full"
                            justify="center"
                            align="center"
                        >
                            <Spinner />
                        </VStack>
                    )}
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup>{/* <Button colorScheme="blue">Done</Button> */}</ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
