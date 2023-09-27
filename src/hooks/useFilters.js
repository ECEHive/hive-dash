import { useCallback, useMemo, useState } from 'react';

import dayjs from '@/lib/time';

export default function useFilters(types, data, showAllDefault = false) {
    const [terms, setTerms] = useState([]);

    const matches = useMemo(() => {
        if (terms.length < 1) {
            if (showAllDefault) return [...data];
            else return [];
        }

        let matches = [...data].filter((print) => {
            let match = true;
            terms.forEach((term) => {
                const type = types.find((type) => type.id === term.split(':')[0]);
                const value = term.split(':')[1].toLowerCase();

                let result = type.match(print, value);

                if (!result) {
                    match = false;
                }
            });
            return match;
        });

        matches = [...matches].sort((a, b) => {
            let aTime = dayjs(a.updatedAt).valueOf();
            let bTime = dayjs(b.updatedAt).valueOf();
            if (aTime > bTime) {
                return -1;
            }
            if (aTime < bTime) {
                return 1;
            }
            return 0;
        });

        return matches;
    }, [terms, data, types, showAllDefault]);

    const search = useCallback(
        (inputValue, callback) => {
            if (inputValue.length < 1) {
                return callback([]);
            }

            let currentResults;
            if (matches.length > 0) {
                currentResults = [...matches];
            } else {
                currentResults = [...data];
            }

            let newResults = [];

            for (const type of types) {
                let targets = currentResults.map((print) => type.format(print));
                let results = targets.filter((thing) => thing.toLowerCase().includes(inputValue.toLowerCase()));
                results = [...new Set(results)]; //removes duplicates
                newResults.push({
                    label: type.label,
                    options: results.map((item) => ({
                        label: item,
                        value: `${type.id}:${item}`
                    }))
                });
            }

            return callback(newResults);
        },
        [data, matches, types]
    );

    return [terms, setTerms, search, matches];
}
