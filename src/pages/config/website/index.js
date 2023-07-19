import {
    Box,
    Center,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Input,
    InputGroup,
    Text,
    VStack
} from '@chakra-ui/react';

import ConfigLayout from '@/layouts/config/ConfigLayout';

export default function WebsiteSettings(props) {
    return (
        <Center w="100%" h="auto" p={5}>
            <VStack w="680px">
                <VStack w="100%" h="auto" spacing={2} align="flex-start">
                    <Heading size="lg">Banner configuration</Heading>

                    <FormControl>
                        <FormLabel mb={0}>Banner title</FormLabel>
                        <FormHelperText mt={0} mb={2}>
                            subtitle helper text
                        </FormHelperText>
                        <InputGroup>
                            <Input />
                        </InputGroup>
                    </FormControl>
                </VStack>
            </VStack>
        </Center>
    );
}

WebsiteSettings.getLayout = (page) => <ConfigLayout>{page}</ConfigLayout>;
