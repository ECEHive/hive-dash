import { useState, useEffect, useMemo } from 'react';
import {
    Card,
    CardBody,
    Heading,
    Text,
    Box,
    HStack,
    Badge,
    Button,
    VStack,
    Progress,
    useColorModeValue,
    Spacer,
    Stat,
    StatLabel,
    StatNumber,
    SimpleGrid,
    Divider,
    ButtonGroup,
    IconButton,
    Tooltip,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    TableContainer,
    StatHelpText,
    Flex,
    Grid,
    GridItem
} from '@chakra-ui/react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { FaWrench } from 'react-icons/fa';
import { ArrowForwardIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { HiMiniQueueList } from 'react-icons/hi2';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import Layout from '@/layouts/printing/PrintingLayout';
import PrinterCard from '@/components/printing/dashboard/PrinterItem';
import CardTemplate from '@/components/printing/dashboard/CardTemplate';

export default function Dashboard(props) {
    return (
        <>
            <Box h="100%" w="100%" overflow="auto" p={5}>
                <SimpleGrid spacing={4} columns={3} w="100%" h="100%">
                    <PrinterCard status="printing" />
                    <PrinterCard status="idle" />
                    <PrinterCard status="down" />
                    <PrinterCard status="printing" />
                    <PrinterCard status="idle" />
                    <PrinterCard status="down" />
                    <PrinterCard status="printing" />
                    <PrinterCard status="idle" />
                    <PrinterCard status="down" />
                    <PrinterCard status="down" />
                </SimpleGrid>
            </Box>
        </>
    );
}

Dashboard.getLayout = (page) => <Layout>{page}</Layout>;
