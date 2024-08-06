'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ElementRef, useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { useGlobalSearch } from '@/common/hooks/global-search';
import reactParser from 'html-react-parser';
import { CommandShortcut } from '../ui/command';
import Link from 'next/link';
import { GlobalSearch as GlobalSearchType } from '../providers/flexsearch-provider';

type GlobalSearchProps = {};

const MAX_RESULTS = 8;

const GlobalSearch: React.FC<GlobalSearchProps> = () => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const { isReady, query, results, setQuery } = useGlobalSearch();
    const divRef = useRef<ElementRef<'div'>>(null);

    const reset = () => {
        setIsActive(false);
        setQuery('');
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (divRef.current && !divRef.current.contains(event.target)) {
                reset();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [divRef]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsActive((curr) => !curr);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    useEffect(() => {
        const onIsActive = () => {
            if (!isActive && !query) return;

            if (!isActive && query) {
                reset();
            }
        };

        onIsActive();

        return () => onIsActive();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, setIsActive, query]);
    return (
        <>
            <div className='relative ml-auto flex-1 md:grow-0'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                    onFocus={() => setIsActive(true)}
                    disabled={!isReady}
                    type='search'
                    placeholder='Search...'
                    className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]'
                />
                <CommandShortcut className='absolute right-2.5 top-1/2 -translate-y-1/2'>
                    ⌘K
                </CommandShortcut>
            </div>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.1,
                        }}
                        className='absolute inset-0 bottom-0 left-0 right-0 top-0 z-50 flex h-screen flex-col items-center bg-black/70 px-4 pt-20 backdrop-blur-sm'
                    >
                        <div className='w-full max-w-xl' ref={divRef}>
                            <motion.input
                                initial={{ opacity: 0, y: -20, scaleX: 0 }}
                                animate={{ opacity: 1, y: [20, 0], scaleX: 1 }}
                                exit={{ opacity: 0, y: -20, scaleX: 0 }}
                                // onBlur={() => setIsActive(false)}
                                transition={{
                                    duration: 0.3,
                                    ease: 'backInOut',
                                }}
                                type='search'
                                placeholder='Search anything...'
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                                autoFocus
                                className='flex h-12 w-full max-w-xl rounded-t-md bg-secondary px-6 py-2 text-lg outline-none ring-0'
                            />
                            <motion.div
                                className='min-h-14 w-full max-w-xl rounded-b-md bg-slate-200 px-2 py-2 dark:bg-zinc-900'
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                exit={{ opacity: 0, scaleX: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: 'backInOut',
                                }}
                            >
                                {results.slice(0, MAX_RESULTS).map((result) => (
                                    <ResultItem
                                        key={result.url}
                                        result={result}
                                        reset={reset}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
export default GlobalSearch;

type ResultItemProps = {
    result: GlobalSearchType;
    reset: () => void;
};

const ResultItem: React.FC<ResultItemProps> = ({ reset, result }) => {
    return (
        <Link href={result.url}>
            <div
                onClick={reset}
                className='w-full rounded-md p-4 hover:bg-secondary'
            >
                <h3 className='text-lg font-semibold text-foreground'>
                    {reactParser(result.title)}
                </h3>
                <p className='text-sm text-muted-foreground'>
                    {reactParser(result.content)}
                </p>
            </div>
        </Link>
    );
};
