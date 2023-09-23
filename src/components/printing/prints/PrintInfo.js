import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Card,
    CardBody,
    Divider,
    GridItem,
    HStack,
    Heading,
    Icon,
    IconButton,
    Link,
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
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';

import dayjs from '@/lib/time';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintUpdate from '@/hooks/printing/usePrintUpdate';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

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
                events: [event, ...selectedPrintData.events]
            };
            printUpdater(selectedPrintData._id, data);
            onCancelClose();
        },
        [printUpdater, onCancelClose, selectedPrintData]
    );

    const latestEvent = useMemo(() => {
        return selectedPrintData?.events?.[0];
    }, [selectedPrintData]);

    const dataFields = useMemo(() => {
        return [
            {
                label: 'Printer',
                icon: iconSet.printer,
                value: printerData?.displayName || betterPrintData?.printer,
                link: `/printing/printers/${betterPrintData?.printer}`
            },
            {
                label: 'Material',
                icon: iconSet.material,
                value: betterPrintData?.materialType
            },
            {
                label: 'Est. material',
                icon: iconSet.materialAmount,
                value: betterPrintData?.materialUsage,
                suffix: betterPrintData?.materialSymbol
            },
            {
                label: 'Est. time',
                icon: iconSet.clock,
                value: betterPrintData?.estTimeFormatted
            }
        ];
    }, [printerData, betterPrintData]);

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

            <Box
                h="full"
                w="full"
                maxW="4xl"
                overflow="auto"
                p={5}
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
                            px={1}
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
                                    <Heading
                                        size="lg"
                                        fontWeight="semibold"
                                    >
                                        {betterPrintData.trayName}
                                    </Heading>
                                    <HStack
                                        w="auto"
                                        h="auto"
                                        align="center"
                                        justify="start"
                                        pb={2}
                                        spacing={3}
                                        overflow="auto"
                                        whiteSpace="nowrap"
                                        // borderRight={actions && '1px'}
                                        // borderRightColor={actions && 'chakra-border-color'}
                                    >
                                        {dataFields.map((field, i) => {
                                            return (
                                                <>
                                                    <VStack
                                                        spacing={1}
                                                        align="start"
                                                    >
                                                        <HStack
                                                            alignItems="center"
                                                            spacing={2}
                                                            color="secondaryText"
                                                        >
                                                            <Icon
                                                                fontSize="lg"
                                                                as={field.icon}
                                                            />
                                                            <HStack
                                                                align="end"
                                                                spacing={1}
                                                                height="full"
                                                            >
                                                                <Text
                                                                    as={field.link ? Link : 'span'}
                                                                    fontSize="xl"
                                                                    fontWeight="medium"
                                                                    lineHeight={1}
                                                                    href={field?.link}
                                                                >
                                                                    {field.value}
                                                                </Text>
                                                                {field.suffix && (
                                                                    <Text fontSize="sm">{field.suffix}</Text>
                                                                )}
                                                            </HStack>
                                                        </HStack>
                                                    </VStack>
                                                    {i < dataFields.length - 1 && (
                                                        <Icon
                                                            color="secondaryText"
                                                            fontSize="sm"
                                                            as={iconSet.dot}
                                                        />
                                                    )}
                                                </>
                                            );
                                        })}
                                    </HStack>
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
                                    <Tab>Print notes</Tab>
                                </TabList>

                                <TabPanels
                                    w="full"
                                    h="full"
                                >
                                    {/* notes */}
                                    <TabPanel px={0}>
                                        <Image
                                            src={betterPrintData.preview}
                                            width={512}
                                            height={512}
                                            alt="preview"
                                            style={{
                                                height: 'full',
                                                width: 'auto'
                                            }}
                                        />
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
            </Box>
        </>
    );
}
