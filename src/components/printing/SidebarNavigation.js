import { useMemo } from 'react';

import { Icon } from '@chakra-ui/react';

import usePrinting from '@/contexts/printing/PrintingContext';

import iconSet from '@/util/icons';

import SidebarTemplate from '@/components/SidebarTemplate';

export default function Navigation({}) {
    const { onNewOpen } = usePrinting();

    const pages = useMemo(
        () => [
            {
                type: 'button',
                name: 'New print',
                icon: <Icon as={iconSet.add} />,
                onClick: () => {
                    onNewOpen();
                },
                colorScheme: 'green',
                auth: true
            },

            {
                type: 'divider',
                auth: true
            },

            {
                type: 'button',
                name: 'Dashboard',
                icon: <Icon as={iconSet.dashboard} />,
                href: '/dashboard'
            },

            {
                type: 'button',
                name: 'Printers',
                icon: <Icon as={iconSet.printer} />,
                href: '/printers'
            },

            {
                type: 'button',
                name: 'Print logs',
                icon: <Icon as={iconSet.table} />,
                href: '/logs'
            },
            {
                type: 'button',
                name: 'Find a print',
                icon: <Icon as={iconSet.search} />,
                href: '/prints'
            },

            {
                type: 'spacer'
            }

            // {
            //     type: 'button',
            //     name: 'Knowledge base',
            //     icon: <Icon as={iconSet.search} />,
            //     href: '/knowledge'
            // }
        ],
        [onNewOpen]
    );

    return (
        <SidebarTemplate
            pageData={pages}
            baseUrl="/printing"
        />
    );
}
