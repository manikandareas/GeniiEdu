'use client';

import { useEffect, useState } from 'react';
import dataSearch from '@/common/constants/search-index.json';
import {
    GlobalSearch,
    useFlexSearch,
} from '../components/providers/flexsearch-provider';
import { useQuery } from '@tanstack/react-query';
import { getClassesForSearch } from '@/actions/classes.actions';
import useCurrentUser from './useCurrentUser';

export const useGlobalSearch = () => {
    const [query, setQuery] = useState<string>('');
    const [isReady, setIsReady] = useState<boolean>(false);
    const [results, setResults] = useState<GlobalSearch[]>([]);
    const user = useCurrentUser();

    const { data: dataClasses, isLoading } = useQuery({
        queryKey: ['search-index', user?.id ?? ''],
        queryFn: () => getClassesForSearch(user?.id ?? ''),
    });

    const { createIndex, searchIndex } = useFlexSearch();

    useEffect(() => {
        if (isLoading || !dataClasses) return;
        const dataIndex = dataClasses.concat(dataSearch[user?.role!]);
        createIndex(dataIndex);
        setIsReady(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, dataClasses]);

    useEffect(() => {
        if (!isReady || query.length < 3) {
            setResults([]);
            return;
        }

        const result = searchIndex(query);
        setResults(result);
    }, [query, isReady]);

    return { query, setQuery, isReady, results };
};
