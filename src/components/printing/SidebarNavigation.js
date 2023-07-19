import { useMemo } from 'react';
import {
    AiFillDashboard,
    AiFillPrinter,
    AiOutlinePlus,
    AiOutlineSearch,
    AiOutlineTable
} from 'react-icons/ai';

import SidebarTemplate from '@/components/SidebarTemplate';

export default function Navigation(props) {
    const pages = useMemo(
        () => [
            {
                type: 'button',
                name: 'New print',
                icon: <AiOutlinePlus />,
                href: '/new',
                colorScheme: 'green'
            },

            {
                type: 'divider'
            },

            {
                type: 'button',
                name: 'Dashboard',
                icon: <AiFillDashboard />,
                href: '/dashboard'
            },
            {
                type: 'button',
                name: 'Printers',
                icon: <AiFillPrinter />,
                href: '/printers'
            },
            {
                type: 'button',
                name: 'Find a print',
                icon: <AiOutlineSearch />,
                href: '/find'
            },
            {
                type: 'button',
                name: 'Print logs',
                icon: <AiOutlineTable />,
                href: '/logs'
            },

            {
                type: 'spacer'
            },

            {
                type: 'button',
                name: 'Knowledge base',
                icon: <AiOutlineSearch />,
                href: '/knowledge'
            }
        ],
        []
    );

    return <SidebarTemplate pageData={pages} baseUrl="/printing" />;
}
