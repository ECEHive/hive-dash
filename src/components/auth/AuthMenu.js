import { useRef, useState } from 'react';

import {
    Button,
    ButtonGroup,
    HStack,
    Icon,
    IconButton,
    PinInput,
    PinInputField,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Spinner,
    Text,
    VStack,
    useToast
} from '@chakra-ui/react';

import { useAuth } from '@/contexts/AuthContext';

import iconSet from '@/util/icons';
import { PINames } from '@/util/roles';

export default function AuthMenu({}) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const initialFocusRef = useRef();

    const { login, userId, roleId, onAuthOpen, isLoggedIn, isAuthOpen, onAuthClose, logout } = useAuth();

    function handleLogin(pin) {
        setLoading(true);
        login(pin)
            .then(() => {
                setLoading(false);
                onAuthClose();
            })
            .catch((err) => {
                setLoading(false);
                onAuthClose();
                toast({
                    title: 'Error',
                    description: err.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                });
            });
    }

    return (
        <Popover
            isOpen={isAuthOpen}
            strategy="absolute"
            onClose={onAuthClose}
            closeOnBlur
            closeOnEsc
            initialFocusRef={initialFocusRef}
        >
            <PopoverTrigger>
                <IconButton
                    onClick={onAuthOpen}
                    colorScheme={isLoggedIn ? 'yellow' : 'gray'}
                >
                    <Icon as={isLoggedIn > 0 ? iconSet.peerInstructor : iconSet.person} />
                </IconButton>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>
                    <HStack
                        fontWeight="medium"
                        justify="start"
                    >
                        <Icon as={iconSet.buzzCard} />
                        <Text>PI Access</Text>
                    </HStack>
                </PopoverHeader>
                <PopoverBody backdropFilter={'blur'}>
                    {!isLoggedIn ? (
                        <>
                            {loading ? (
                                <>
                                    <VStack
                                        w="full"
                                        h="full"
                                        justify="center"
                                    >
                                        <Spinner />
                                    </VStack>
                                </>
                            ) : (
                                <VStack align="start">
                                    <HStack
                                        w="full"
                                        justify="space-evenly"
                                    >
                                        <PinInput
                                            size="lg"
                                            type="number"
                                            onChange={(e) => {
                                                if (e.length === 4) {
                                                    handleLogin(e);
                                                }
                                            }}
                                        >
                                            <PinInputField ref={initialFocusRef} />
                                            <PinInputField />
                                            <PinInputField />
                                            <PinInputField />
                                        </PinInput>
                                    </HStack>
                                </VStack>
                            )}
                        </>
                    ) : (
                        <>
                            <VStack
                                align="start"
                                w="full"
                                spacing={5}
                            >
                                <VStack
                                    spacing={0}
                                    align="start"
                                >
                                    <Text
                                        fontSize="xl"
                                        fontWeight="bold"
                                    >
                                        Hello!
                                    </Text>
                                    <Text>You&apos;re logged in as a {PINames[roleId]}</Text>
                                </VStack>

                                <VStack w="full">
                                    <ButtonGroup
                                        w="full"
                                        variant="outline"
                                    >
                                        <Button
                                            w="full"
                                            leftIcon={<Icon as={iconSet.logout} />}
                                            colorScheme="red"
                                            onClick={logout}
                                        >
                                            Sign out
                                        </Button>
                                    </ButtonGroup>
                                </VStack>
                            </VStack>
                        </>
                    )}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
