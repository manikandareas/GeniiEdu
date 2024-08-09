'use client';

import React, { createContext, PropsWithChildren } from 'react';

// Create the InputContext
export const InputContext = createContext<{
    grades: { grade: number | null; id: string; isGraded: boolean }[];
    setGrades: React.Dispatch<
        React.SetStateAction<
            { grade: number | null; id: string; isGraded: boolean }[]
        >
    >;
}>({
    grades: [],
    setGrades: () => {},
});

// Create the InputGradeContextProvider component
export const InputGradeContextProvider: React.FC<PropsWithChildren> = ({
    children,
}) => {
    const [grades, setGrades] = React.useState<
        { grade: number | null; id: string; isGraded: boolean }[]
    >([]);

    return (
        <InputContext.Provider
            value={{
                grades,
                setGrades,
            }}
        >
            {children}
        </InputContext.Provider>
    );
};

export const useInputGradeContext = () => {
    const context = React.useContext(InputContext);
    if (context === undefined) {
        throw new Error(
            'useInputGradeContext must be used within a InputGradeContextProvider',
        );
    }
    return context;
};
