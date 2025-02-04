'use client';

import initialData from '@/app/_constants/search-index.json';
import {
    GlobalSearch,
    useFlexSearch,
} from '@/app/_providers/flex-search-provider';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useCurrentUser from './current-user';
import { queryStore } from './query/query-store';

export const useGlobalSearch = () => {
    const [query, setQuery] = useState<string>('');
    const [isReady, setIsReady] = useState<boolean>(false);
    const [results, setResults] = useState<GlobalSearch[]>([]);
    const user = useCurrentUser();

    const { data: dataClasses, isLoading } = useQuery(
        queryStore.user.globalSearch(user?.id as string),
    );

    const { createIndex, searchIndex } = useFlexSearch();

    useEffect(() => {
        if (isLoading || !dataClasses) return;
        const dataIndex = dataClasses.concat(initialData[user?.role!]);
        createIndex(dataIndex);
        setIsReady(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, dataClasses]);

    useEffect(() => {
        if (!isReady || query.length === 0) {
            setResults([]);
            return;
        }

        const result = searchIndex(query);
        setResults(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, isReady]);

    return { query, setQuery, isReady, results };
};
