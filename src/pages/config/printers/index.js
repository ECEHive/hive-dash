import { Button, ButtonGroup, Flex, HStack, Heading, Icon, VStack } from '@chakra-ui/react';

import iconSet from '@/util/icons';

import ConfigLayout from '@/layouts/config/ConfigLayout';

export default function People(props) {
    return (
        <>
            <Flex
                w="full"
                h="full"
                p={5}
                overflow="hidden"
                direction="column"
                justify="center"
                align="center"
            >
                <VStack
                    w="full"
                    maxW="xl"
                    h="full"
                    spacing={3}
                    align="start"
                    overflow="hidden"
                >
                    <Heading
                        size="lg"
                        fontFamily="body"
                    >
                        3D Printers
                    </Heading>

                    <VStack
                        w="full"
                        h="full"
                        align="start"
                        spacing={3}
                    >
                        <VStack
                            w="auto"
                            h="auto"
                            align="start"
                        ></VStack>
                    </VStack>
                </VStack>

                <HStack
                    w="full"
                    h="auto"
                    justify="end"
                >
                    <ButtonGroup w="auto">
                        <Button
                            colorScheme="blue"
                            isLoading={null}
                            leftIcon={<Icon as={iconSet.save} />}
                            onClick={null}
                        >
                            Save
                        </Button>
                    </ButtonGroup>
                </HStack>
            </Flex>
        </>
    );
}

People.getLayout = (page) => <ConfigLayout>{page}</ConfigLayout>;
