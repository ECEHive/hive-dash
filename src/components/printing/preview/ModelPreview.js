import { useMemo, useState } from 'react';

import {
    Box,
    HStack,
    Icon,
    IconButton,
    Spacer,
    Text,
    VStack,
    useColorModeValue,
    useDisclosure
} from '@chakra-ui/react';

import iconSet from '@/util/icons';

import { STLViewer } from '@/components/STLViewer';

import PreviewModal from './PreviewModal';

export default function ModelPreview({ printData, ...props }) {
    const files = useMemo(() => {
        if (printData) {
            return printData.stlFiles;
        }
        return [];
    }, [printData]);

    const [selectedFile, setSelectedFile] = useState(0);

    const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();

    const unselectedColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
    const selectedColor = useColorModeValue('gray', 'white');

    return (
        <>
            <Box
                position="relative"
                {...props}
            >
                {files?.length > 0 ? (
                    <>
                        <PreviewModal
                            isOpen={isPreviewOpen}
                            onClose={onPreviewClose}
                            printData={printData}
                            files={files}
                        />

                        <VStack
                            zIndex="banner"
                            p={2}
                            position="absolute"
                            w="full"
                            h="auto"
                        >
                            <HStack w="full">
                                <Spacer />
                                <IconButton
                                    size="xs"
                                    icon={<Icon as={iconSet.external} />}
                                    variant="ghost"
                                    onClick={onPreviewOpen}
                                />
                            </HStack>
                        </VStack>

                        <VStack
                            zIndex="banner"
                            p={2}
                            position="absolute"
                            bottom={0}
                            w="full"
                            h="auto"
                            align="center"
                        >
                            <IconButton
                                size="xs"
                                variant="unset"
                            />
                            <HStack
                                w="full"
                                justify="center"
                                spacing={2}
                                gap={0}
                            >
                                {files.map((file, index) => (
                                    <Icon
                                        as={iconSet.paginateDot}
                                        key={file}
                                        fontSize="sm"
                                        variant="ghost"
                                        color={index === selectedFile ? selectedColor : unselectedColor}
                                        onClick={() => {
                                            if (index === selectedFile) return;
                                            setSelectedFile(index);
                                        }}
                                        cursor="pointer"
                                    />
                                ))}
                            </HStack>
                        </VStack>

                        <STLViewer
                            url={files[selectedFile]}
                            w="full"
                            h="full"
                        />
                    </>
                ) : (
                    <VStack
                        w="full"
                        h="full"
                        justify="center"
                        color="secondaryText"
                    >
                        <Text>No preview</Text>
                    </VStack>
                )}
            </Box>
        </>
    );
}
