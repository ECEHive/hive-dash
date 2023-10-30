import { useCallback, useEffect, useState } from 'react';

import {
    Box,
    Button,
    Code,
    Flex,
    HStack,
    Icon,
    IconButton,
    Spacer,
    Spinner,
    Text,
    Tooltip,
    VStack
} from '@chakra-ui/react';

import { useDropzone } from 'react-dropzone';

import iconSet from '@/util/icons';

import { STLViewer } from '@/components/STLViewer';

export default function STLInput({ files, setFiles }) {
    const [selectedFile, setSelectedFile] = useState(0);
    const [stlLoading, setStlLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(true);

    const onDrop = useCallback(
        (acceptedFiles) => {
            setFiles([...files, ...acceptedFiles]);
            setShowUpload(false);
        },
        [setFiles, files]
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    useEffect(() => {
        if (files.length > 0) {
            setShowUpload(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box
            w="full"
            h="auto"
            position="relative"
            overflow="hidden"
        >
            {showUpload || files.length < 1 ? (
                <>
                    <Box
                        w="full"
                        h="300px"
                        {...getRootProps()}
                        position="relative"
                    >
                        <input
                            {...getInputProps()}
                            accept=".stl"
                            multiple
                            zIndex={5}
                        />
                        <VStack
                            h="full"
                            align="center"
                            justify="center"
                            position="relative"
                        >
                            {!isDragActive ? (
                                <>
                                    <VStack>
                                        <Icon
                                            fontSize="2xl"
                                            as={iconSet.add}
                                        />
                                        <Text textAlign="center">
                                            Drag and drop STL files here, or click to open the select dialog
                                        </Text>
                                    </VStack>
                                </>
                            ) : (
                                <Text>Drop file here!</Text>
                            )}
                        </VStack>
                    </Box>
                    {files.length > 0 && (
                        <HStack
                            w="full"
                            justify="center"
                        >
                            <IconButton
                                size="sm"
                                position="absolute"
                                bottom={0}
                                right={0}
                                zIndex={10}
                                onClick={() => {
                                    setShowUpload(false);
                                }}
                                icon={<Icon as={iconSet.x} />}
                            >
                                Cancel
                            </IconButton>
                        </HStack>
                    )}
                </>
            ) : (
                <>
                    <VStack
                        w="full"
                        minHeight="300px"
                        position="relative"
                        align="start"
                        overflow="hidden"
                    >
                        <Box
                            w="full"
                            h="full"
                            display="flex"
                            flexDir="column"
                            flexGrow={1}
                            position="relative"
                        >
                            {stlLoading && (
                                <Flex
                                    position="absolute"
                                    bgColor="blackAlpha.400"
                                    w="full"
                                    h="full"
                                    align="center"
                                    justify="center"
                                    zIndex="tooltip"
                                    borderRadius={5}
                                >
                                    <Spinner />
                                </Flex>
                            )}
                            <HStack
                                position="absolute"
                                w="full"
                                py={2}
                                px={3}
                                zIndex="tooltip"
                            >
                                <Code
                                    bgColor="transparent"
                                    fontWeight="bold"
                                >
                                    {files[selectedFile].name}
                                </Code>
                                <Spacer />
                                <IconButton
                                    size="sm"
                                    colorScheme="red"
                                    icon={<Icon as={iconSet.delete} />}
                                    onClick={() => {
                                        const newFiles = files;
                                        newFiles.splice(selectedFile, 1);
                                        setFiles(newFiles);
                                        setSelectedFile(0);
                                        if (newFiles.length === 0) {
                                            setShowUpload(true);
                                        }
                                    }}
                                />
                            </HStack>
                            <STLViewer
                                zIndex={1}
                                url={URL.createObjectURL(files[selectedFile])}
                                style={{
                                    width: '100%',
                                    height: '250px'
                                }}
                                borderRadius={5}
                                shadows
                                orbitControls
                                onFinishLoading={() => {
                                    setStlLoading(false);
                                }}
                                canvasId="upload-canvas"
                            />
                        </Box>
                        <HStack
                            w="full"
                            h="auto"
                            spacing={3}
                        >
                            <Box
                                w="auto"
                                h="auto"
                                overflowX="auto"
                            >
                                <HStack
                                    w="full"
                                    h="full"
                                    p={1}
                                >
                                    {files.map((f, index) => {
                                        const file = f;
                                        return (
                                            <>
                                                <Flex
                                                    bg="transparent"
                                                    w="auto"
                                                    h="auto"
                                                >
                                                    <Box
                                                        variant="outline"
                                                        as={Button}
                                                        cursor="pointer"
                                                        size="sm"
                                                        p={2}
                                                        border="1px solid"
                                                        borderColor="chakra-border-color"
                                                        borderRadius={5}
                                                        isActive={selectedFile === index}
                                                        onClick={() => {
                                                            setSelectedFile(index);
                                                            setStlLoading(true);
                                                        }}
                                                    >
                                                        <HStack w="auto">
                                                            <Code
                                                                bgColor="transparent"
                                                                w="auto"
                                                                whiteSpace="nowrap"
                                                                textOverflow="unset"
                                                                overflow="hidden"
                                                                fontSize="sm"
                                                            >
                                                                {file.name}
                                                            </Code>
                                                        </HStack>
                                                    </Box>
                                                </Flex>
                                            </>
                                        );
                                    })}
                                </HStack>
                            </Box>
                            <Spacer />
                            <Tooltip label="Add more files">
                                <IconButton
                                    colorScheme="blue"
                                    onClick={() => {
                                        setShowUpload(true);
                                    }}
                                    size="sm"
                                    icon={<Icon as={iconSet.add} />}
                                />
                            </Tooltip>
                        </HStack>
                    </VStack>
                </>
            )}
        </Box>
    );
}
