import { BreadcrumbURLs } from '../_components/elements/generate-breadcrumb';
import { create } from 'zustand';

type HeaderState = {
    breadcrumbs: BreadcrumbURLs;
    title: string;
    isShown?: boolean;

    setTitle: (title: string) => void;
    setBreadcrumbs: (urls: BreadcrumbURLs) => void;
    setIsShown: (isShown: boolean) => void;
};

const initialState: BreadcrumbURLs = [];

export const useHeaderStore = create<HeaderState>()((set) => ({
    breadcrumbs: initialState,
    title: '',
    isShown: true,
    setBreadcrumbs: (urls: BreadcrumbURLs) =>
        set((state) => ({ ...state, breadcrumbs: urls })),
    setTitle: (title: string) => set((state) => ({ ...state, title })),
    setIsShown: (isShown: boolean) => set((state) => ({ ...state, isShown })),
}));
