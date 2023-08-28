import { useCallback, useState } from 'react';

import { Box, Center, HStack, Icon, IconButton, Spinner, Text, VStack, chakra } from '@chakra-ui/react';

import { useDropzone } from 'react-dropzone';
import { StlViewer } from 'react-stl-viewer';

import iconSet from '@/util/icons';

const ChakraStlViewer = chakra(StlViewer);

export default function STLInput({ file, setFile }) {
    const onDrop = useCallback(
        (acceptedFiles) => {
            setLoading(true);
            console.log(acceptedFiles[0]);
            setFile(acceptedFiles[0]);
        },
        [setFile]
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const [loading, setLoading] = useState(false);

    return (
        <Box
            w="full"
            h="300px"
            position="relative"
        >
            {!file ? (
                <Box
                    w="full"
                    h="full"
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <HStack
                        h="full"
                        align="center"
                        justify="center"
                    >
                        {!isDragActive ? (
                            <VStack>
                                <Icon
                                    fontSize="2xl"
                                    as={iconSet.add}
                                />
                                <Text>Drag and drop your STL file here, or click to select a file</Text>
                            </VStack>
                        ) : (
                            <Text>Release to drop the files here!</Text>
                        )}
                    </HStack>
                </Box>
            ) : (
                <>
                    <VStack
                        w="full"
                        h="full"
                        position="relative"
                        align="start"
                    >
                        <Box
                            w="full"
                            position="relative"
                            flexGrow={1}
                        >
                            <ChakraStlViewer
                                zIndex={1}
                                url={URL.createObjectURL(file)}
                                w="full"
                                h="full"
                                modelProps={{
                                    // set color to a pastel yellow
                                    color: '#f5f5dc',
                                    scale: 1
                                }}
                                shadows
                                orbitControls={true}
                                canvasId="stl-canvas"
                                border="1px solid"
                                borderColor="chakra-border-color"
                                borderRadius={5}
                                onFinishLoading={() => {
                                    setLoading(false);
                                }}
                            />

                            {loading && (
                                <Center
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    w="full"
                                    h="full"
                                    zIndex={1}
                                    backdropBlur={5}
                                >
                                    <Spinner />
                                </Center>
                            )}

                            <IconButton
                                position="absolute"
                                top={3}
                                right={3}
                                zIndex={2}
                                icon={<Icon as={iconSet.delete} />}
                                onClick={() => {
                                    setFile(null);
                                }}
                                size="sm"
                                colorScheme="red"
                                alignSelf="flex-end"
                            />
                        </Box>
                    </VStack>
                </>
            )}
        </Box>
    );
}
