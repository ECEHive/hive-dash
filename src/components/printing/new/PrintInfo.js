import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
    Button,
    ButtonGroup,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Input,
    InputGroup,
    InputRightAddon,
    VStack
} from '@chakra-ui/react';

import PrintingContext from '@/contexts/printing/PrintingContext';

export default function PrintInfo({ data, set, setNext }) {
    const { printerTypes } = useContext(PrintingContext);

    const selectedPrinterTypeData = useMemo(() => {
        return printerTypes.find((p) => p.id === data.printer.type);
    }, [data.printer.type, printerTypes]);

    const update = useCallback(
        (field, value) => {
            set((old) => {
                return {
                    ...old,
                    print: {
                        ...old.print,
                        [field]: value
                    }
                };
            });
        },
        [set]
    );

    useEffect(() => {
        if (selectedPrinterTypeData.materials.length === 1 && data.print.material === '') {
            update('material', selectedPrinterTypeData.materials[0]);
        }
    }, [selectedPrinterTypeData, update, data]);

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
            <Heading
                size="lg"
                fontFamily="body"
            >
                Print info
            </Heading>

            <VStack
                w="100%"
                h="100%"
                spacing={3}
                overflow="auto"
                p={1}
            >
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
                    <FormHelperText>Format: (M/PI)_Firstname_Lastname_printdescription</FormHelperText>
                </FormControl>
                <FormControl>
                    <FormLabel>Estimated print time</FormLabel>
                    <Input
                        type="text"
                        placeholder="9:00"
                        value={data.print.time}
                        onChange={(e) => {
                            let r = (e.target.value.match(/[0-9.:]+/g) || []).join('');
                            update('time', r);
                        }}
                    />
                    {/* show an alert if time is over 9 hours confirming MPI approval */}
                </FormControl>
                <FormControl w="100%">
                    <FormLabel>Material</FormLabel>
                    <ButtonGroup
                        w="100%"
                        isAttached
                        variant="outline"
                    >
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
                        <InputRightAddon>{selectedPrinterTypeData.materialUnits.symbol}</InputRightAddon>
                    </InputGroup>
                </FormControl>
            </VStack>
        </>
    );
}
