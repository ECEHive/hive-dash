import { useEffect, useState } from 'react';

export default function usePIs() {
    const [PIList, setPIList] = useState(null);

    useEffect(() => {
        fetch('/api/peerInstructors', {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((data) => {
                setPIList(data.peerInstructors);
            });
    }, []);

    return PIList;
}
