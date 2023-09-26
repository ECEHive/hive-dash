import { useState } from 'react';

import {
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    Text,
    VStack,
    useToast
} from '@chakra-ui/react';

import { useAuth } from '@/contexts/AuthContext';

import iconSet from '@/util/icons';

export default function PinModal({ isOpen, onClose }) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { login, userId } = useAuth();

    function handleLogin(pin) {
        setLoading(true);
        login(pin)
            .then(() => {
                setLoading(false);
                onClose();
            })
            .catch((err) => {
                setLoading(false);
                onClose();
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
        <>
            <Modal
                isOpen={isOpen}
                isCentered
                size="xs"
                closeOnOverlayClick
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <HStack
                            fontWeight="medium"
                            justify="start"
                        >
                            <Icon as={iconSet.buzzCard} />
                            <Text>PI Access</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalBody>
                        {}
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
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </VStack>
                    </ModalBody>
                    <ModalFooter />
                </ModalContent>
            </Modal>
        </>
    );
}

// export default function AuthModal({}) {
//     return (
//         <>
//             <Modal
//                 isOpen={true}
//                 isCentered
//                 size="sm"
//             >
//                 <ModalOverlay />
//                 <ModalContent>
//                     <ModalBody p={6}>
//                         <HStack
//                             w="full"
//                             spacing={5}
//                             justify="start"
//                         >
//                             <Icon
//                                 fontSize="5xl"
//                                 as={iconSet.buzzCard}
//                             />
//                             <VStack
//                                 align="start"
//                                 spacing={1}
//                             >
//                                 <Text
//                                     fontSize="3xl"
//                                     fontWeight="bold"
//                                     lineHeight={1}
//                                 >
//                                     Present BuzzCard
//                                 </Text>
//                                 <Text fontSize="md">for PI access</Text>
//                             </VStack>
//                         </HStack>
//                         <Input
//                             autoFocus
//                             placeholder="BuzzCard Number"
//                             onChange={(e) => {
//                                 console.log(e.target.value);
//                             }}
//                             w={0}
//                             h={0}
//                             variant="unstyled"
//                             position="absolute"
//                             top={0}
//                         />
//                     </ModalBody>
//                 </ModalContent>
//             </Modal>
//         </>
//     );
// }
