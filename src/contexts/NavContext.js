import { createContext, useContext, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

const NavContext = createContext({});

function useNav() {
    return useContext(NavContext);
}

function NavProvider({ children }) {
    const pathname = usePathname();
    const [page, setPage] = useState('');
    const [section, setSection] = useState('');

    useEffect(() => {
        if (pathname) {
            setPage(pathname.split('/')[2] || '');
            setSection(pathname.split('/')[1]);
        }
    }, [pathname]);

    return <NavContext.Provider value={{ pathname, page, section }}>{children}</NavContext.Provider>;
}

export default useNav;
export { NavProvider };
