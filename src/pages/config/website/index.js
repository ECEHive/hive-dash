import { useCallback, useEffect, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    ButtonGroup,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Input,
    InputGroup,
    Switch,
    Text,
    Textarea,
    VStack,
    useToast
} from '@chakra-ui/react';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { Field, Form, Formik } from 'formik';
import ReactMarkdown from 'react-markdown';

import useRequest from '@/hooks/useRequest';

import ConfigLayout from '@/layouts/ConfigLayout';
import GlobalLayout from '@/layouts/GlobalLayout';

import { Select } from '@/components/Select';

export default function WebsiteSettings(props) {
    const [config, setConfig] = useState({});

    const toast = useToast();
    const request = useRequest();

    const refresh = useCallback(() => {
        request('/api/config/website', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((data) => {
                console.log(data.config);
                setConfig(data.config);
            })
            .catch((err) => {});
    }, [request]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <Box
            w="full"
            h="full"
            overflow="hidden"
        >
            <Flex
                w="full"
                h="full"
                overflow="auto"
                direction="column"
                align="center"
            >
                <VStack
                    spacing={5}
                    h="auto"
                    w="6xl"
                    align="start"
                    justify="start"
                    maxW="6xl"
                    p={5}
                >
                    <Heading
                        size="lg"
                        fontFamily="body"
                    >
                        Website configuration
                    </Heading>

                    {config?.banner && (
                        <Formik
                            initialValues={{
                                enabled: config.banner.enabled,
                                type: config.banner.type,
                                title: config.banner.title,
                                description: config.banner.description
                            }}
                            onSubmit={(values, actions) => {
                                let config = {
                                    banner: {
                                        ...values
                                    }
                                };

                                request('/api/config/website', {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(config)
                                })
                                    .then((data) => {
                                        toast({
                                            description: 'Saved banner',
                                            status: 'success',
                                            duration: 5000
                                        });
                                    })
                                    .catch((err) => {})
                                    .finally(() => {
                                        actions.setSubmitting(false);
                                        refresh();
                                    });
                            }}
                        >
                            {(props) => (
                                <Form
                                    style={{
                                        width: '100%'
                                    }}
                                >
                                    <VStack
                                        spacing={3}
                                        w="full"
                                    >
                                        <VStack
                                            spacing={3}
                                            align="start"
                                            w="full"
                                        >
                                            <Text
                                                fontSize="2xl"
                                                fontWeight="semibold"
                                                fontFamily="body"
                                            >
                                                Banner
                                            </Text>

                                            <Field name="enabled">
                                                {({ field }) => (
                                                    <FormControl>
                                                        <FormLabel>Banner enabled</FormLabel>
                                                        <InputGroup>
                                                            <Switch
                                                                {...field}
                                                                isChecked={field?.value}
                                                            />
                                                        </InputGroup>
                                                        <FormHelperText>
                                                            Show the banner on all pages on the website.
                                                        </FormHelperText>
                                                    </FormControl>
                                                )}
                                            </Field>

                                            <Field name="type">
                                                {({ field, form }) => (
                                                    <FormControl>
                                                        <FormLabel>Banner type</FormLabel>
                                                        <Select
                                                            {...field}
                                                            name="type"
                                                            options={[
                                                                { value: 'info', label: 'Info' },
                                                                { value: 'warning', label: 'Warning' },
                                                                { value: 'success', label: 'Success' },
                                                                { value: 'error', label: 'Error' }
                                                            ]}
                                                            onChange={(selectedOption) => {
                                                                return form.setFieldValue('type', selectedOption);
                                                            }}
                                                            value={field?.value}
                                                        />
                                                        <FormHelperText>
                                                            Controls the color/icon of the banner
                                                        </FormHelperText>
                                                    </FormControl>
                                                )}
                                            </Field>

                                            <Field name="title">
                                                {({ field, form }) => (
                                                    <FormControl>
                                                        <FormLabel>Banner title</FormLabel>
                                                        <InputGroup>
                                                            <Input {...field} />
                                                        </InputGroup>
                                                    </FormControl>
                                                )}
                                            </Field>

                                            <Field name="description">
                                                {({ field, form }) => {
                                                    console.log(props);
                                                    return (
                                                        <FormControl>
                                                            <FormLabel>Banner description</FormLabel>
                                                            <InputGroup>
                                                                <Textarea {...field} />
                                                            </InputGroup>
                                                            <FormHelperText>Markdown is supported.</FormHelperText>
                                                        </FormControl>
                                                    );
                                                }}
                                            </Field>

                                            <VStack
                                                w="full"
                                                h="auto"
                                                align="start"
                                            >
                                                <Text>Banner preview</Text>
                                                <Alert
                                                    status={props.values.type.value}
                                                    w="full"
                                                    h="auto"
                                                >
                                                    <AlertIcon />
                                                    <Box>
                                                        <AlertTitle>{props.values.title}</AlertTitle>
                                                        <AlertDescription>
                                                            <ReactMarkdown
                                                                components={ChakraUIRenderer()}
                                                                skipHtml
                                                            >
                                                                {props.values.description}
                                                            </ReactMarkdown>
                                                        </AlertDescription>
                                                    </Box>
                                                </Alert>
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
                                                    isLoading={props.isSubmitting}
                                                    type={'submit'}
                                                    onClick={() => {
                                                        props.handleSubmit();
                                                    }}
                                                    onSubmit={() => {
                                                        props.handleSubmit();
                                                    }}
                                                >
                                                    Save
                                                </Button>
                                            </ButtonGroup>
                                        </HStack>
                                    </VStack>
                                </Form>
                            )}
                        </Formik>
                    )}
                </VStack>
            </Flex>
        </Box>
    );
}

WebsiteSettings.getLayout = (page) => (
    <GlobalLayout>
        <ConfigLayout>{page}</ConfigLayout>
    </GlobalLayout>
);
