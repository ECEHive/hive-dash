import { Button, Card, CardBody, Flex, Heading, VStack } from '@chakra-ui/react';

import { SAMLAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

export default function Login({}) {
    const auth = getAuth();
    const provider = new SAMLAuthProvider('saml.gatech-sso');
    return (
        <Flex
            minW="full"
            minH="100vh"
            p={5}
            align="center"
            justify="center"
        >
            <Card
                variant="outline"
                maxW="md"
                w="full"
            >
                <CardBody>
                    <VStack
                        w="full"
                        align="start"
                        spacing={3}
                    >
                        <Heading
                            size="lg"
                            fontFamily="body"
                        >
                            Hi!
                        </Heading>

                        <Button
                            w="full"
                            onClick={() => {
                                signInWithPopup(auth, provider)
                                    .then((userCredential) => {
                                        console.log(userCredential);
                                        // setCookieAndRedirect(userCredential, navigate, location);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }}
                        >
                            Login with GT
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </Flex>
    );
}
