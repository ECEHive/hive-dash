import { useCallback, useEffect, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Badge,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Center,
    Code,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputLeftElement,
    InputRightAddon,
    Spacer,
    Switch,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
    VStack,
    chakra,
    useColorModeValue,
    useDisclosure
} from '@chakra-ui/react';

import Editor from '@monaco-editor/react';
import { Select } from 'chakra-react-select';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';

import useTextColor from '@/hooks/useTextColor';

import iconSet from '@/util/icons';
import { PITypes } from '@/util/roles';

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
