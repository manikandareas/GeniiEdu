'use client';
import FlexSearch from 'flexsearch';
import React from 'react';

export type FlexSearchContext = {
    flexSearch: FlexSearch.Index;
};

const flexSearchContext = React.createContext<FlexSearchContext | null>(null);

type FlexSearchProviderProps = {
    children: React.ReactNode;
};

const FlexSearchProvider: React.FC<FlexSearchProviderProps> = ({
    children,
}) => {
    const flexSearch = new FlexSearch.Index({
        tokenize: 'forward',
    });
    return (
        <flexSearchContext.Provider value={{ flexSearch }}>
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
