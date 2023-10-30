import { useEffect, useMemo, useState } from 'react';

import {
    Box,
    Divider,
    HStack,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack
} from '@chakra-ui/react';

import { getMetadata, ref } from 'firebase/storage';

import { storage } from '@/lib/firebase';

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

function FileInfo({ metadata }) {
    return (
        <>
            <VStack
                align="start"
                spacing={0}
                justify="start"
            >
                <Heading
                    size="lg"
                    fontFamily="monospace"
                >
                    {metadata.name}
                </Heading>
                <Text>{shrinkBytes(metadata.size)}</Text>
            </VStack>
        </>
    );
}

function FileList({ metadatas }) {
    return (
        <>
            <VStack spacing={3}>
                {metadatas.map((metadata) => (
                    <VStack
                        w="full"
                        key={metadata.fullPath}
                        align="start"
                        spacing={0}
                    >
                        <Text
                            fontSize="md"
                            fontWeight="medium"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                        >
                            {metadata.name}
                        </Text>
                        <Text fontSize="xs">{shrinkBytes(metadata.size)}</Text>
                    </VStack>
                ))}
            </VStack>
        </>
    );
}

export default function PreviewModal({ isOpen, onClose, printData, files }) {
    const [selectedFile, setSelectedFile] = useState(0);

    const [metadatas, setMetadatas] = useState([]);

    const fileRefs = useMemo(() => {
        if (files) {
            setMetadatas([]);
            return files.map((file) => ref(storage, file));
        }
        return null;
    }, [files]);

    useEffect(() => {
        if (fileRefs) {
            fileRefs.forEach((ref) => {
                getMetadata(ref).then((metadata) => {
                    setMetadatas((prev) => [...prev, metadata]);
                });
            });
        } else {
            setMetadatas([]);
        }
    }, [fileRefs]);

    const selectedMetadata = useMemo(() => {
        if (metadatas?.length > 0) {
            console.log(metadatas);
            const data = metadatas.find((metadata) => metadata.fullPath === fileRefs[selectedFile].fullPath);
            return data;
        }
        return null;
    }, [metadatas, fileRefs, selectedFile]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="3xl"
            isCentered
            scrollBehavior="inside"
        >
            <ModalOverlay />
            {metadatas?.length > 0 && (
                <>
                    <ModalContent>
                        <ModalCloseButton />
                        <ModalHeader>STL files - {printData.trayName}</ModalHeader>
                        <ModalBody
                            w="full"
                            h="full"
                        >
                            <Box
                                w="full"
                                minH="500px"
                            >
                                <HStack
                                    w="full"
                                    minH="full"
                                    align="start"
                                    spacing={8}
                                >
                                    <VStack
                                        maxW="1200px"
                                        h="full"
                                        align="start"
                                        justify="center"
                                    >
                                        {metadatas && selectedMetadata && (
                                            <>
                                                <FileInfo metadata={selectedMetadata} />
                                                <Divider />
                                                <FileList metadatas={metadatas} />
                                            </>
                                        )}
                                    </VStack>

                                    <VStack
                                        w="full"
                                        minH="full"
                                        flexGrow={1}
                                        bgColor="chakra-body-bg"
                                        borderRadius={5}
                                    >
                                        <STLViewer
                                            url={files[selectedFile]}
                                            style={{
                                                width: '100%',
                                                height: '100%'
                                            }}
                                        />
                                    </VStack>
                                </HStack>
                            </Box>
                        </ModalBody>
                    </ModalContent>
                </>
            )}
        </Modal>
    );
}
