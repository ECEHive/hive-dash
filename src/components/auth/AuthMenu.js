import { useRef, useState } from 'react';

import {
    Button,
    ButtonGroup,
    HStack,
    Icon,
    IconButton,
    Input,
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
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const initialFocusRef = useRef();

    const { login, user, userData, roleId, onAuthOpen, isAuthOpen, onAuthClose, logout } = useAuth();

    function handleLogin(result) {
        console.log(result);
        setIsLoading(true);
        if (result && result.includes('903')) {
            const gtid = result.split('=')[1];
            console.log(gtid);
            login(gtid)
                .then(() => {
                    onAuthClose();
                })
                .catch((err) => {
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
        setIsLoading(false);
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
                    colorScheme={user ? 'yellow' : 'gray'}
                >
                    <Icon as={user ? iconSet.peerInstructor : iconSet.person} />
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
                    {!user ? (
                        <>
                            {isLoading ? (
                                <>
                                    <HStack
                                        w="full"
                                        h="full"
                                        justify="center"
                                        p={3}
                                    >
                                        <Spinner />
                                        <Text>Logging you in...</Text>
                                    </HStack>
                                </>
                            ) : (
                                <VStack align="start">
                                    <Text>Present your BuzzCard to log in!</Text>
                                    <Input
                                        ref={initialFocusRef}
                                        placeholder="BuzzCard Number"
                                        position="absolute"
                                        variant="unstyled"
                                        top={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                console.log(input);
                                                handleLogin(input);
                                            }
                                        }}
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                        }}
                                        onBlur={() => {
                                            onAuthClose();
                                        }}
                                        w={0}
                                    />
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
                                        Hello, {userData?.name}!
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
