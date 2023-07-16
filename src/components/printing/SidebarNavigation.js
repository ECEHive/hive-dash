import {
    AiFillDashboard,
    AiFillPrinter,
    AiOutlinePlus,
    AiOutlineSearch
} from 'react-icons/ai';
import SidebarTemplate from '@/components/SidebarTemplate';
import { useMemo } from 'react';

export default function Navigation(props) {

    const pages = useMemo(() => [
        {
            type: 'button',
            name: 'New print',
            icon: <AiOutlinePlus />,
            href: '/new',
            colorScheme: 'green'
        },

        {
            type: "divider"
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
            type: "spacer"
        },

        {
            type: 'button',
            name: 'Knowledge base',
            icon: <AiOutlineSearch />,
            href: '/knowledge'
        }
    ], []);

    return (
        <SidebarTemplate pageData={pages} baseUrl="/printing"/>     
    );
}
