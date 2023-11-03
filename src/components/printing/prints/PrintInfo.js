import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Card,
    CardBody,
    Divider,
    Flex,
    GridItem,
    HStack,
    Heading,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    Tooltip,
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';

import dayjs from '@/lib/time';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintUpdate from '@/hooks/printing/usePrintUpdate';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

import PrintInfoFields from '@/components/printing/PrintInfoFields';
import BigPreview from '@/components/printing/preview/BigPreview';
import PrintEditorModal from '@/components/printing/printEdit/PrintEditorModal';
import UpdateModal from '@/components/printing/printers/UpdateModal';
import Timeline from '@/components/printing/prints/Timeline';

function DetailsPane({ title, icon, rowSpan, colSpan, children }) {
    return (
        <GridItem
            rowSpan={rowSpan}
            colSpan={colSpan}
        >
            <Card
                variant="outline"
                w="full"
                h="full"
            >
                <CardBody>
                    <VStack
                        w="full"
                        h="full"
                        align="start"
                    >
                        <HStack>
                            <Icon as={icon} />
                            <Text
                                fontSize="xl"
                                fontWeight="semibold"
                            >
                                {title}
                            </Text>
                        </HStack>

                        {children}
                    </VStack>
                </CardBody>
            </Card>
        </GridItem>
    );
}

export default function PrintInfo({ selectedPrintData }) {
    const router = useRouter();

    const { betterPrintData, printerData } = usePrintParser(selectedPrintData);

    const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure();
    const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();

    const [cancelEventData, setCancelEventData] = useState(null);

    const { update: printUpdater } = usePrintUpdate();

    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        setTabIndex(0);
    }, [selectedPrintData]);

    const cancelPrint = useCallback(() => {
        setCancelEventData({
            type: PrintStates.CANCELED,
            notes: '',
            timestamp: dayjs.utc().toISOString()
        });
        onCancelOpen();
    }, [onCancelOpen]);

    const confirmCancel = useCallback(
        (event) => {
            let data = {
                ...selectedPrintData,
                state: PrintStates.CANCELED,
                events: [...selectedPrintData.events, event]
            };
            printUpdater(selectedPrintData._id, data);
            onCancelClose();
        },
        [printUpdater, onCancelClose, selectedPrintData]
    );

    const latestEvent = useMemo(() => {
        return selectedPrintData?.events?.[selectedPrintData.events.length - 1];
    }, [selectedPrintData]);

    return (
        <>
            {selectedPrintData && (
                <>
                    <UpdateModal
                        isOpen={isCancelOpen}
                        onClose={onCancelClose}
                        eventData={cancelEventData}
                        save={(event) => {
                            confirmCancel(event);
                        }}
                    />
                    <PrintEditorModal
                        isOpen={isEditorOpen}
                        onClose={onEditorClose}
                        initialData={selectedPrintData}
                    />
                </>
            )}

            <Flex
                w="full"
                h="full"
                overflow="auto"
                direction="column"
                align="center"
            >
                {selectedPrintData ? (
                    <>
                        <VStack
                            position="relative"
                            w="full"
                            h="auto"
                            justify="center"
                            align="start"
                            spacing={3}
                            p={5}
                            maxW="6xl"
                        >
                            <HStack
                                w="full"
                                position="relative"
                                overflow="hidden"
                                align="start"
                            >
                                <VStack
                                    align="start"
                                    justify="start"
                                    spacing={2}
                                >
                                    <HStack
                                        w="auto"
                                        h="auto"
                                    >
                                        <Heading
                                            size="lg"
                                            fontWeight="semibold"
                                            overflowWrap="anywhere"
                                        >
                                            {betterPrintData.trayName}
                                        </Heading>
                                        {betterPrintData.linkedPrintId && (
                                            <Tooltip label="Linked to live print job">
                                                <span>
                                                    <Icon
                                                        fontSize="lg"
                                                        as={iconSet.link}
                                                        textColor="secondaryTextAlt"
                                                    />
                                                </span>
                                            </Tooltip>
                                        )}
                                    </HStack>
                                    <PrintInfoFields
                                        fields={['printer', 'material', 'materialAmount', 'estTime']}
                                        print={selectedPrintData}
                                    />
                                </VStack>
                                <Spacer />
                                <Menu strategy="fixed">
                                    <MenuButton
                                        as={IconButton}
                                        icon={<Icon as={iconSet.hamburger} />}
                                        variant={'ghost'}
                                    />
                                    <MenuList>
                                        <MenuItem
                                            icon={<Icon as={iconSet.pencil} />}
                                            onClick={onEditorOpen}
                                        >
                                            Edit print
                                        </MenuItem>
                                        <MenuItem
                                            icon={<Icon as={iconSet.minus} />}
                                            onClick={cancelPrint}
                                            isDisabled={
                                                selectedPrintData.state === PrintStates.CANCELED ||
                                                selectedPrintData.state === PrintStates.COMPLETED
                                            }
                                        >
                                            Cancel print
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>

                            <Divider />

                            {/* ERROR BANNERS */}
                            {printerData?.type === 'stratasys' && selectedPrintData.state !== PrintStates.CANCELED ? (
                                <Box
                                    w="100%"
                                    h="auto"
                                >
                                    <Alert
                                        status="warning"
                                        borderRadius={5}
                                    >
                                        <AlertIcon />
                                        <AlertDescription>
                                            This print uses QSR supports, which we remove for you. Expect it to be ready
                                            one business day later than the print completion date.
                                        </AlertDescription>
                                    </Alert>
                                </Box>
                            ) : null}
                            {selectedPrintData.state === PrintStates.CANCELED && (
                                <Box
                                    w="100%"
                                    h="auto"
                                >
                                    <Alert
                                        status="error"
                                        borderRadius={5}
                                    >
                                        <AlertIcon />
                                        <AlertDescription>This print has been canceled</AlertDescription>
                                    </Alert>
                                </Box>
                            )}
                            {/* --- */}

                            <Timeline print={selectedPrintData} />

                            <Tabs
                                w="full"
                                index={tabIndex}
                                onChange={(index) => {
                                    setTabIndex(index);
                                }}
                                flexGrow={1}
                            >
                                <TabList>
                                    <Tab>Preview</Tab>
                                    <Tab isDisabled={betterPrintData.notes.length == 0}>Print notes</Tab>
                                </TabList>

                                <TabPanels
                                    w="full"
                                    h="full"
                                >
                                    {/* notes */}
                                    <TabPanel px={0}>
                                        {selectedPrintData?.stlFiles?.length > 0 ? (
                                            <Box
                                                w="full"
                                                h="500px"
                                            >
                                                <BigPreview
                                                    files={selectedPrintData.stlFiles}
                                                    altBackground
                                                />
                                            </Box>
                                        ) : (
                                            <Text color="secondaryText">No preview available</Text>
                                        )}
                                    </TabPanel>

                                    <TabPanel>
                                        <ReactMarkdown components={ChakraUIRenderer()}>
                                            {selectedPrintData.notes}
                                        </ReactMarkdown>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </VStack>
                    </>
                ) : (
                    <VStack
                        minH="100%"
                        w="100%"
                        justify="center"
                    >
                        <Text color="gray.400">select a print</Text>
                    </VStack>
                )}
            </Flex>
        </>
    );
}
