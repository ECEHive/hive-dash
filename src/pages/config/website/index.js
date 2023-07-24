import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Center,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Input,
    InputGroup,
    Switch,
    Text,
    VStack
} from '@chakra-ui/react';

import ConfigLayout from '@/layouts/config/ConfigLayout';

export default function WebsiteSettings(props) {
    return (
        <Center
            w="100%"
            h="auto"
            p={5}
        >
            <VStack w="container.sm">
                <VStack
                    w="100%"
                    h="auto"
                    spacing={3}
                    align="flex-start"
                >
                    <Heading size="lg">Banner configuration</Heading>

                    <FormControl>
                        <FormLabel>Banner enabled</FormLabel>
                        <InputGroup>
                            <Switch />
                        </InputGroup>
                        <FormHelperText>subtitle helper text</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Banner title</FormLabel>
                        <InputGroup>
                            <Input />
                        </InputGroup>
                        <FormHelperText>subtitle helper text</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Banner description</FormLabel>
                        <InputGroup>
                            <Input />
                        </InputGroup>
                        <FormHelperText>subtitle helper text</FormHelperText>
                    </FormControl>

                    <VStack
                        w="100%"
                        h="auto"
                        align="start"
                    >
                        <Text>Banner preview</Text>
                        <Alert
                            status="error"
                            w="100%"
                            h="auto"
                        >
                            <AlertIcon />
                            <Box>
                                <AlertTitle>The HIVE closes August 15</AlertTitle>
                                <AlertDescription>
                                    Expect 3D printing queues to be longer than usual. We recommend a lead time of 2
                                    weeks.
                                </AlertDescription>
                            </Box>
                        </Alert>
                    </VStack>
                </VStack>
            </VStack>
        </Center>
    );
}

WebsiteSettings.getLayout = (page) => <ConfigLayout>{page}</ConfigLayout>;
