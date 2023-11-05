import { useMemo } from 'react';

import usePrinting from '@/contexts/printing/PrintingContext';

import iconSet from '@/util/icons';
import { PITypes } from '@/util/roles';

import SidebarTemplate from '@/components/SidebarTemplate';

export default function Navigation({}) {
    const { onNewOpen } = usePrinting();

    const pages = useMemo(
        () => [
            {
                type: 'button',
                name: 'New print',
                icon: iconSet.add,
                onClick: () => {
                    onNewOpen();
                },
                colorScheme: 'green',
                minRole: PITypes.PI
            },

            {
                type: 'divider',
                minRole: PITypes.PI
            },

            {
                type: 'button',
                name: 'Dashboard',
                icon: iconSet.dashboard,
                href: '/dashboard'
            },

            {
                type: 'button',
                name: 'Printers',
                icon: iconSet.printer,
                href: '/printers'
            },

            {
                type: 'button',
                name: 'Print logs',
                icon: iconSet.table,
                href: '/logs'
            },
            {
                type: 'button',
                name: 'Find a print',
                icon: iconSet.search,
                href: '/prints'
            },

            {
                type: 'spacer'
            },

            {
                type: 'ext_button',
                name: 'HIVE Wiki',
                icon: iconSet.lightbulb,
                href: 'https://wiki.hive.ece.gatech.edu/doku.php?id=start#d_printing'
            }
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
