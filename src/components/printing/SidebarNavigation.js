import { useMemo } from 'react';

import { Icon } from '@chakra-ui/react';

import iconSet from '@/util/icons';

import SidebarTemplate from '@/components/SidebarTemplate';

export default function Navigation(props) {
    const pages = useMemo(
        () => [
            {
                type: 'button',
                name: 'New print',
                icon: <Icon as={iconSet.add} />,
                href: '/new',
                colorScheme: 'green'
            },

            {
                type: 'divider'
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
                name: 'Find a print',
                icon: <Icon as={iconSet.search} />,
                href: '/find'
            },
            {
                type: 'button',
                name: 'Print logs',
                icon: <Icon as={iconSet.table} />,
                href: '/logs'
            },

            {
                type: 'spacer'
            },

            {
                type: 'button',
                name: 'Knowledge base',
                icon: <Icon as={iconSet.search} />,
                href: '/knowledge'
            }
        ],
        []
    );

    return (
        <SidebarTemplate
            pageData={pages}
            baseUrl="/printing"
        />
    );
}
