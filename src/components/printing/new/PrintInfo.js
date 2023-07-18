import { useMemo, useState, useEffect, useContext, useCallback } from 'react';
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

import PrintingContext from '@/contexts/PrintingContext';

export default function PrintInfo({ data, set, setNext }) {
    const { printerTypes } = useContext(PrintingContext);

    const selectedPrinterTypeData = useMemo(() => {
        return printerTypes.find((p) => p.id === data.printer.type);
    }, [data.printer.type, printerTypes]);
    
    const forceUseMaterial = useMemo(() => {
        return selectedPrinterTypeData.materials.length === 1;
    }, [selectedPrinterTypeData]);
    
    function update(field, value) {
        set({
            ...data,
            print: {
                ...data.print,
                [field]: value
            }
        });
    }

    const validate = useCallback(() => {
        if (
            data.print.name !== '' &&
            data.print.time !== '' &&
            data.print.material !== '' &&
            data.print.materialUsage !== ''
        ) {
            setNext(true);
        } else {
            setNext(false);
        }
    }, [data, setNext]);

    useEffect(() => {
        validate();
    }, [validate]);

    return (
        <>
            <Heading size="lg" fontFamily="body">
                Print info
            </Heading>

            <VStack w="100%" h="100%" spacing={3} overflow="auto" p={1}>
                <FormControl w="100%">
                    <FormLabel>Tray name</FormLabel>
                    <Input
                        type="text"
                        placeholder="George_Brudell_benchy"
                        value={data.print.name}
                        onChange={(e) => {
                            update('name', e.target.value);
                        }}
                    />
                    <FormHelperText>
                        Format: (M/PI)_Firstname_Lastname_printdescription
                    </FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>Estimated print time</FormLabel>
                    <Input
                        type="text"
                        placeholder="9:00"
                        value={data.print.time}
                        onChange={(e) => {
                            update('time', e.target.value);
                        }}
                    />
                    {/* show an alert if time is over 9 hours confirming MPI approval */}
                </FormControl>
                <FormControl w="100%">
                    <FormLabel>Material</FormLabel>
                    <ButtonGroup w="100%" isAttached variant="outline">
                        {selectedPrinterTypeData.materials.map((material) => {
                            return (
                                <Button
                                    w="100%"
                                    key={material}
                                    onClick={() => {
                                        update('material', material);
                                    }}
                                    isActive={data.print.material === material}
                                >
                                    {material}
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Estimated material usage</FormLabel>
                    <InputGroup>
                        <Input
                            type="number"
                            value={data.print.materialUsage}
                            onChange={(e) => {
                                update('materialUsage', e.target.value);
                            }}
                        />
                        <InputRightAddon>
                            {selectedPrinterTypeData.materialUnits.symbol}
                        </InputRightAddon>
                    </InputGroup>
                </FormControl>
            </VStack>
        </>
    );
}
