'use client';
import { getMatches, replaceTextWithMarker } from '@/common/libs/utils';
import FlexSearch from 'flexsearch';
import React from 'react';

export type GlobalSearch = {
    title: string;
    content: string;
    url: string;
};

export type FlexSearchContext = {
    flexSearch: FlexSearch.Index;
    data: GlobalSearch[];
    setData: React.Dispatch<React.SetStateAction<GlobalSearch[]>>;
    createIndex: (dataForQuery: GlobalSearch[]) => void;
    searchIndex: (searchTerm: string) => GlobalSearch[];
};

const flexSearchContext = React.createContext<FlexSearchContext | null>(null);

type FlexSearchProviderProps = {
    children: React.ReactNode;
};

const FlexSearchProvider: React.FC<FlexSearchProviderProps> = ({
    children,
}) => {
    const [flexSearch] = React.useState<FlexSearch.Index>(
        new FlexSearch.Index({
            tokenize: 'forward',
        }),
    );
    const [data, setData] = React.useState<GlobalSearch[]>([]);

    const createIndex = (dataForQuery: GlobalSearch[]) => {
        dataForQuery.forEach((itm, idx) => {
            const item = `${itm.title} ${itm.content}`;
            flexSearch.add(idx, item);
        });
        setData(dataForQuery);
    };

    const searchIndex = (searchTerm: string) => {
        const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const searchResults = flexSearch.search(match);
        const res = searchResults
            .map((index) => data[index as number])
            .map(({ url, title, content }) => {
                return {
                    url,
                    title: replaceTextWithMarker(title, match),
                    content: getMatches(content, match).join('').toString(),
                };
            });
        return res;
    };

    return (
        <flexSearchContext.Provider
            value={{ flexSearch, data, setData, createIndex, searchIndex }}
        >
            {children}
        </flexSearchContext.Provider>
    );
};
export default FlexSearchProvider;

export const useFlexSearch = () => {
    const context = React.useContext(flexSearchContext);
    if (!context) {
        throw new Error(
            'useFlexSearch must be used within a FlexSearchProvider',
        );
    }
    return context;
};
