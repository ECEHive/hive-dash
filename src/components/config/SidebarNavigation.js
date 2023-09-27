import { useMemo } from 'react';

import { Icon } from '@chakra-ui/react';

import iconSet from '@/util/icons';

import SidebarTemplate from '@/components/SidebarTemplate';

export default function Navigation(props) {
    const pages = useMemo(
        () => [
            {
                type: 'button',
                name: 'Printers',
                icon: <Icon as={iconSet.printer} />,
                href: '/printers'
            },
            {
                type: 'button',
                name: 'People',
                icon: <Icon as={iconSet.person} />,
                href: '/people'
            },
            {
                type: 'button',
                name: 'Website',
                icon: <Icon as={iconSet.site} />,
                href: '/website'
            }
        ],
        []
    );

    return (
        <SidebarTemplate
            pageData={pages}
            baseUrl="/config"
        />
    );
}
