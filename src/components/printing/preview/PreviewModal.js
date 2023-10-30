import { useEffect, useMemo, useState } from 'react';

import {
    HStack,
    Heading,
    Icon,
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

function FileInfo({ metadata }) {
    return (
        <>
            <VStack
                align="start"
                w="full"
                spacing={0}
                justify="start"
                p={5}
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
                    <Text>{dayjs(metadata.updated).toString()}</Text>
                </HStack>
            </VStack>
        </>
    );
}

function FileList({ metadatas }) {
    return (
        <>
            <HStack
                spacing={3}
                w="full"
                overflow="auto"
                p={1}
            >
                {metadatas.map((metadata) => (
                    <VStack
                        w="auto"
                        h="full"
                        key={metadata.fullPath}
                        align="start"
                        spacing={0}
                        p={3}
                        border="1px solid"
                        borderRadius={5}
                        borderColor="chakra-border-color"
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
                ))}
            </HStack>
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
                            <VStack
                                w="full"
                                minH="500px"
                                align="start"
                                position="relative"
                                spacing={5}
                            >
                                <VStack
                                    w="full"
                                    h="full"
                                    flexGrow={1}
                                    bgColor="chakra-body-bg"
                                    position="relative"
                                    borderRadius={5}
                                >
                                    <FileInfo metadata={selectedMetadata} />
                                    <STLViewer
                                        url={files[selectedFile]}
                                        w="full"
                                        h="full"
                                    />
                                </VStack>

                                <VStack
                                    w="full"
                                    h="full"
                                    align="start"
                                    justify="center"
                                    overflow="hidden"
                                >
                                    {metadatas && selectedMetadata && <FileList metadatas={metadatas} />}
                                </VStack>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </>
            )}
        </Modal>
    );
}
