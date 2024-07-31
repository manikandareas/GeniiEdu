'use client';
import FlexSearch from 'flexsearch';
import { useEffect, useState } from 'react';
import dataSearch from '@/common/constants/search-index.json';
import { getMatches, replaceTextWithMarker } from '../libs/flexsearch';

export const useGlobalSearch = () => {
    const [query, setQuery] = useState<string>('');
    const [isReady, setIsReady] = useState<boolean>(false);
    const [results, setResults] = useState<
        { title: string; content: string[]; url: string }[]
    >([]);
    const [flexSearch] = useState<FlexSearch.Index>(
        new FlexSearch.Index({
            tokenize: 'forward',
        }),
    );

    const createIndex = (data: typeof dataSearch.teacher) => {
        data.forEach((itm, idx) => {
            const item = `${itm.title} ${itm.content}`;
            flexSearch.add(idx, item);
        });
    };

    useEffect(() => {
        createIndex(dataSearch.teacher);
        setIsReady(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isReady || query.length < 3) {
            setResults([]);
            return;
        }

        const searchIndex = (searchTerm: string) => {
            const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const searchResults = flexSearch.search(match);

            return searchResults
                .map((index) => dataSearch.teacher[index as number])
                .map(({ url, title, content }) => {
                    return {
                        url,
                        title: replaceTextWithMarker(title, match),
                        content: getMatches(content, match),
                    };
                });
        };

        const result = searchIndex(query);
        setResults(result);
    }, [query, isReady, flexSearch]);

    return { query, setQuery, isReady, results };
};
