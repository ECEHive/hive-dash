import { useCallback, useState } from 'react';

import { Box, Button, HStack, Icon, IconButton, Text, VStack, chakra } from '@chakra-ui/react';

import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { StlViewer } from 'react-stl-viewer';

import iconSet from '@/util/icons';

const ChakraStlViewer = chakra(StlViewer);

export default function STLInput({ image, setImage }) {
    const [file, setFile] = useState(null);

    const onDrop = useCallback(
        (acceptedFiles) => {
            console.log(acceptedFiles[0]);
            setFile(acceptedFiles[0]);
        },
        [setFile]
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const captureImage = useCallback(() => {
        setTimeout(() => {
            const canvas = document.getElementById('stl-canvas').firstChild.firstChild;
            const dataURL = canvas.toDataURL('image/png');

            setImage(dataURL);
        }, 1000);
    }, [setImage]);

    return (
        <Box
            w="full"
            h="auto"
            position="relative"
        >
            {!file && !image ? (
                <Box
                    w="full"
                    h="300px"
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
                        h="400px"
                        p={3}
                        position="relative"
                        align="start"
                    >
                        <Box
                            w="full"
                            position="relative"
                            flexGrow={1}
                        >
                            {!image ? (
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
                                />
                            ) : (
                                <>
                                    <Image
                                        src={image}
                                        alt="stl file"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </>
                            )}
                            <IconButton
                                position="absolute"
                                top={3}
                                right={3}
                                zIndex={2}
                                icon={<Icon as={iconSet.delete} />}
                                onClick={() => {
                                    setFile(null);
                                    setImage(null);
                                }}
                                size="sm"
                                colorScheme="red"
                                alignSelf="flex-end"
                            />
                            {!image ? (
                                <Button
                                    position="absolute"
                                    left="50%"
                                    transform="translateX(-50%)"
                                    zIndex={2}
                                    bottom={3}
                                    onClick={() => {
                                        //take screenshot of canvas
                                        const canvas = document.getElementById('stl-canvas').firstChild.firstChild;
                                        const dataURL = canvas.toDataURL('image/png');

                                        setImage(dataURL);
                                    }}
                                    size="sm"
                                    colorScheme="blue"
                                    leftIcon={<Icon as={iconSet.camera} />}
                                    isDisabled={image}
                                >
                                    Save preview
                                </Button>
                            ) : (
                                <Button
                                    position="absolute"
                                    left="50%"
                                    transform="translateX(-50%)"
                                    zIndex={2}
                                    bottom={3}
                                    onClick={() => {
                                        setImage(null);
                                    }}
                                    size="sm"
                                    colorScheme="yellow"
                                    leftIcon={<Icon as={iconSet.refresh} />}
                                >
                                    Retake preview
                                </Button>
                            )}
                        </Box>
                        <Text
                            fontSize="sm"
                            color="secondaryText"
                        >
                            Try to orient the model so it&apos;s recognizable to help PIs identify the print later. Use
                            as much space within the outlined area as possible.
                        </Text>
                    </VStack>
                </>
            )}
        </Box>
    );
}
