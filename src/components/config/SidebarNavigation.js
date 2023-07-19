import { useMemo } from 'react';
import {
    AiFillDashboard,
    AiFillPrinter,
    AiFillSmile,
    AiOutlinePlus,
    AiOutlineSearch
} from 'react-icons/ai';

import SidebarTemplate from '@/components/SidebarTemplate';

export default function Navigation(props) {
    const pages = useMemo(
        () => [
            {
                type: 'button',
                name: 'Printers',
                icon: <AiFillPrinter />,
                href: '/printers'
            },
            {
                type: 'button',
                name: 'People',
                icon: <AiFillSmile />,
                href: '/people'
            },
            {
                type: 'button',
                name: 'Website',
                icon: <AiFillDashboard />,
                href: '/website'
            }
        ],
        []
    );

    return <SidebarTemplate pageData={pages} baseUrl="/config" />;
}
