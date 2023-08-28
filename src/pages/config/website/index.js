import { useCallback, useEffect, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Center,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Icon,
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

import iconSet from '@/util/icons';

import ConfigLayout from '@/layouts/ConfigLayout';
import GlobalLayout from '@/layouts/GlobalLayout';

import Select from '@/components/Select';

export default function WebsiteSettings(props) {
    const [config, setConfig] = useState({});

    const toast = useToast();

    const refresh = useCallback(() => {
        fetch('/api/config/website')
            .then((res) => res.json())
            .then((data) => {
                console.log(data.config);
                setConfig(data.config);
            });
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <Flex
            w="full"
            h="full"
            p={5}
            overflow="hidden"
            direction="column"
            align="center"
        >
            {/* have to wrap everything just to get the scrollbar all the way over on the right :( */}
            <Center
                w="full"
                h="auto"
                overflow="auto"
            >
                <VStack
                    w="full"
                    maxW="2xl"
                    h="full"
                    spacing={3}
                    align="flex-start"
                    justify="start"
                    px={1}
                >
                    <Heading
                        size="lg"
                        fontFamily="body"
                    >
                        Website configuration
                    </Heading>

                    <Card
                        variant="outline"
                        w="full"
                    >
                        <CardBody p={0}>
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

                                        fetch('/api/config/website', {
                                            method: 'PUT',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify(config)
                                        })
                                            .then((res) => res.json())
                                            .then((data) => {
                                                toast({
                                                    description: 'Saved banner',
                                                    status: 'success',
                                                    duration: 5000
                                                });
                                            })
                                            .finally(() => {
                                                actions.setSubmitting(false);
                                                refresh();
                                            });
                                    }}
                                >
                                    {(props) => (
                                        <Form>
                                            <VStack
                                                spacing={3}
                                                align="start"
                                                w="full"
                                                p={5}
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
                                                    w="100%"
                                                    h="auto"
                                                    align="start"
                                                >
                                                    <Text>Banner preview</Text>
                                                    <Alert
                                                        status={props.values.type.value}
                                                        w="100%"
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
                                                borderTop="1px"
                                                borderColor="chakra-border-color"
                                                py={3}
                                                px={5}
                                            >
                                                <ButtonGroup w="auto">
                                                    <Button
                                                        colorScheme="blue"
                                                        leftIcon={<Icon as={iconSet.save} />}
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
                                        </Form>
                                    )}
                                </Formik>
                            )}
                        </CardBody>
                    </Card>
                </VStack>
            </Center>
        </Flex>
    );
}

WebsiteSettings.getLayout = (page) => (
    <GlobalLayout>
        <ConfigLayout>{page}</ConfigLayout>
    </GlobalLayout>
);
