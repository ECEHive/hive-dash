import { useEffect, useMemo, useState } from 'react';

import {
    Box,
    Button,
    Flex,
    HStack,
    Heading,
    Icon,
    IconButton,
    Link,
    Spacer,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import { getMetadata, ref } from 'firebase/storage';

import { storage } from '@/lib/firebase';
import dayjs from '@/lib/time';

import iconSet from '@/util/icons';

import { STLViewer } from '@/components/STLViewer';

function shrinkBytes(bytes) {
    // figure out if it should be displayed as KB, MB, or GB
    let unit = 'B';
    let size = bytes;
    if (size > 1024) {
        unit = 'KB';
        size /= 1024;
    }
    if (size > 1024) {
        unit = 'MB';
        size /= 1024;
    }
    if (size > 1024) {
        unit = 'GB';
        size /= 1024;
    }

    // round to 2 decimal places
    size = Math.round(size * 100) / 100;
    return `${size}${unit}`;
}

function FileInfo({ url, metadata }) {
    return (
        <>
            <HStack
                p={5}
                align="start"
            >
                <VStack
                    align="start"
                    w="full"
                    spacing={0}
                    justify="start"
                >
                    <Heading
                        size="lg"
                        fontFamily="monospace"
                    >
                        {metadata.name}
                    </Heading>
                    <HStack
                        fontSize="sm"
                        spacing={1}
                    >
                        <Text>{shrinkBytes(metadata.size)}</Text>
                        <Icon as={iconSet.dot} />
                        <Text>{dayjs.utc(metadata.updated).local().format('MM/DD/YYYY hh:mmA')}</Text>
                    </HStack>
                </VStack>
                <Spacer />
                <IconButton
                    icon={<Icon as={iconSet.download} />}
                    as={Link}
                    href={url}
                    download
                    target="_blank"
                    variant="ghost"
                    colorScheme="blue"
                />
            </HStack>
        </>
    );
}

function FileList({ metadatas, selectedFile, setSelectedFile }) {
    return (
        <>
            <HStack
                spacing={3}
                w="full"
                h="full"
                overflowX="auto"
                overflowY="hidden"
                py={2}
            >
                {Object.keys(metadatas).map((url) => {
                    const metadata = metadatas[url];
                    return (
                        <Flex
                            bg="transparent"
                            w="auto"
                            h="auto"
                            key={metadata.fullPath}
                        >
                            <Box
                                w="auto"
                                h="full"
                                align="start"
                                direction="column"
                                border="1px solid"
                                borderRadius={5}
                                borderColor="chakra-border-color"
                                as={Button}
                                onClick={() => {
                                    setSelectedFile(url);
                                }}
                                isActive={selectedFile === url}
                                p={0}
                            >
                                <VStack
                                    w="full"
                                    h="full"
                                    align="start"
                                    justify="start"
                                    spacing={1}
                                    p={3}
                                >
                                    <Text
                                        fontSize="md"
                                        textOverflow="ellipsis"
                                        whiteSpace="nowrap"
                                        fontFamily="mono"
                                        fontWeight="bold"
                                    >
                                        {metadata.name}
                                    </Text>
                                    <Text fontSize="xs">{shrinkBytes(metadata.size)}</Text>
                                </VStack>
                            </Box>
                        </Flex>
                    );
                })}
            </HStack>
        </>
    );
}

export default function BigPreview({ files, filesOnTop, altBackground }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const [metadatas, setMetadatas] = useState({});

    const bgColor = useColorModeValue('chakra-subtle-bg', 'chakra-body-bg');
    const bgColorAlt = useColorModeValue('chakra-subtle-bg', 'chakra-subtle-bg');

    const fileRefs = useMemo(() => {
        if (files) {
            setMetadatas({});
            let output = {};
            files.forEach((file) => {
                output[file] = ref(storage, file);
            });
            return output;
        }
        return null;
    }, [files]);

    useEffect(() => {
        if (fileRefs) {
            Object.keys(fileRefs).forEach((url) => {
                getMetadata(fileRefs[url]).then((metadata) => {
                    setMetadatas((prev) => {
                        return { ...prev, [url]: metadata };
                    });
                });
            });
        } else {
            setMetadatas([]);
        }
    }, [fileRefs]);

    useEffect(() => {
        setSelectedFile(files ? files[0] : null);
    }, [files]);

    const selectedMetadata = useMemo(() => {
        if (Object.values(metadatas)?.length > 0 && selectedFile) {
            const data = metadatas[selectedFile];
            return data;
        }
        return null;
    }, [metadatas, selectedFile]);

    return (
        <>
            {Object.values(metadatas)?.length > 0 && selectedMetadata && (
                <Box
                    w="full"
                    h="full"
                    minH="full"
                >
                    <VStack
                        w="full"
                        h="full"
                        align="start"
                        position="relative"
                        spacing={2}
                    >
                        {filesOnTop && (
                            <VStack
                                w="full"
                                h="auto"
                                align="start"
                                justify="center"
                            >
                                {metadatas && selectedMetadata && (
                                    <FileList
                                        metadatas={metadatas}
                                        selectedFile={selectedFile}
                                        setSelectedFile={setSelectedFile}
                                    />
                                )}
                            </VStack>
                        )}

                        <VStack
                            w="full"
                            h="full"
                            flexGrow={1}
                            bgColor={altBackground ? bgColorAlt : bgColor}
                            position="relative"
                            borderRadius={5}
                        >
                            <Box
                                position="absolute"
                                zIndex="banner"
                                w="full"
                                h="auto"
                            >
                                <FileInfo
                                    url={selectedFile}
                                    metadata={selectedMetadata}
                                />
                            </Box>
                            <STLViewer
                                url={selectedFile}
                                w="full"
                                h="full"
                                position="absolute"
                                top={0}
                            />
                        </VStack>

                        {!filesOnTop && (
                            <VStack
                                w="full"
                                h="auto"
                                align="start"
                                justify="center"
                            >
                                {metadatas && selectedMetadata && (
                                    <FileList
                                        metadatas={metadatas}
                                        selectedFile={selectedFile}
                                        setSelectedFile={setSelectedFile}
                                    />
                                )}
                            </VStack>
                        )}
                    </VStack>
                </Box>
            )}
        </>
    );
}
