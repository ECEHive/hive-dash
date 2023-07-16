import { useMemo, useState, useEffect } from 'react';
import {
    Heading,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightAddon,
    FormHelperText,
    ButtonGroup,
    Button
} from '@chakra-ui/react';

export default function PrintInfo(props) {
    return (
        <>
            <Heading size="lg" fontFamily="body">
                Print info
            </Heading>

            <VStack w="100%" h="100%" spacing={3} overflow="auto">
                <FormControl>
                    <FormLabel>Tray name</FormLabel>
                    <Input type="text" placeholder="George_Brudell_benchy" />
                    <FormHelperText>Format: (PI)_Firstname_Lastname_printdescription</FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>Estimated print time</FormLabel>
                    <Input type="text" placeholder="9:00" /> 
                    {/* show an alert if time is over 9 hours confirming MPI approval */}
                </FormControl>
                <FormControl w="100%">
                    <FormLabel>Material</FormLabel>
                    <ButtonGroup w="100%" isAttached variant="outline">
                        <Button w="100%">ABS</Button>
                        <Button w="100%">PLA</Button>
                    </ButtonGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Estimated material usage</FormLabel>
                    <InputGroup>
                        <Input type="number" />
                        <InputRightAddon>in^3</InputRightAddon>
                    </InputGroup>
                </FormControl>
            </VStack>
        </>
    );
}
