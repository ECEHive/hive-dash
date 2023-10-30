import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';

import BigPreview from '@/components/printing/preview/BigPreview';

export default function PreviewModal({ isOpen, onClose, printData, files }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="3xl"
            isCentered
            scrollBehavior="inside"
        >
            <ModalOverlay />

            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>STL files - {printData.trayName}</ModalHeader>
                <ModalBody
                    w="full"
                    h="500px"
                >
                    <BigPreview files={files} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
