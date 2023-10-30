import { useMemo } from 'react';

import iconSet from '@/util/icons';

import SidebarTemplate from '@/components/SidebarTemplate';

export default function Navigation(props) {
    const pages = useMemo(
        () => [
            {
                type: 'button',
                name: 'Printers',
                icon: iconSet.printer,
                href: '/printers'
            },
            {
                type: 'button',
                name: 'People',
                icon: iconSet.person,
                href: '/people'
            },
            {
                type: 'button',
                name: 'Website',
                icon: iconSet.site,
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
