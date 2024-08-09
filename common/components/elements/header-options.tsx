'use client';

import { useEffect } from 'react';
import { BreadcrumbURLs } from './generate-breadcrumb';
import { useHeaderStore } from '@/common/stores/header-store';

type HeaderOptionsProps = {
    urls?: BreadcrumbURLs;
    title?: string;
    isShown?: boolean;
};

const HeaderOptions: React.FC<HeaderOptionsProps> = ({
    urls = [],
    title = '',
    isShown = true,
}) => {
    const { setBreadcrumbs, setTitle, setIsShown } = useHeaderStore(
        (state) => ({
            setTitle: state.setTitle,
            setBreadcrumbs: state.setBreadcrumbs,
            setIsShown: state.setIsShown,
        }),
    );

    useEffect(() => {
        if (urls.length > 0) {
            setBreadcrumbs(urls);
        }
    }, [urls, setBreadcrumbs]);

    useEffect(() => {
        if (title) {
            setTitle(title);
        }
    }, [title, setTitle]);

    useEffect(() => {
        setIsShown(isShown);
    }, [setIsShown, isShown]);

    return null;
};
export default HeaderOptions;
