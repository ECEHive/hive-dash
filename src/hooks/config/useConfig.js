import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useConfig() {
    const [websiteConfig, setWebsiteConfig] = useState({});

    const refresh = useCallback(() => {
        fetch('/api/config/website')
            .then((res) => res.json())
            .then((data) => {
                setWebsiteConfig(data.config);
            });
    }, []);
}
