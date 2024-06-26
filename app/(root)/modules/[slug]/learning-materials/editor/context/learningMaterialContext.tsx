'use client';

import { LearningMaterialsModel } from '@/common/models';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';

type LearningMaterialContext = {
    form: UseFormReturn<
        {
            title: string;
            content: string;
            files?:
                | {
                      type: 'video' | 'image' | 'pdf' | 'youtube';
                      url: string;
                      key: string;
                      id: string;
                  }[]
                | undefined;
        },
        any,
        undefined
    >;
};

const learningMaterialContext =
    React.createContext<LearningMaterialContext | null>(null);

type LearningMaterialProviderProps = {
    children: React.ReactNode;
};

const LearningMaterialProvider: React.FC<LearningMaterialProviderProps> = (
    props,
) => {
    const { children } = props;

    const form = useForm<
        z.infer<typeof LearningMaterialsModel.insertLearningMaterialsSchema>
    >({
        resolver: zodResolver(
            LearningMaterialsModel.insertLearningMaterialsSchema,
        ),
        defaultValues: {
            content: 'Explanation of the content',
            files: [],
            title: 'Learning Materials Title',
        },
    });

    return (
        <learningMaterialContext.Provider value={{ form }}>
            {children}
        </learningMaterialContext.Provider>
    );
};
export default LearningMaterialProvider;

export const useLearningMaterialContext = () => {
    const context = React.useContext(learningMaterialContext);
    if (!context) {
        throw new Error(
            'useLearningMaterialContext must be used within a LearningMaterialProvider',
        );
    }

    return context;
};
