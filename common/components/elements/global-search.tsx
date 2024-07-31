'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { useGlobalSearch } from '@/common/hooks/global-search';
import reactParser from 'html-react-parser';
import { CommandShortcut } from '../ui/command';

type GlobalSearchProps = {};

const GlobalSearch: React.FC<GlobalSearchProps> = () => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const { isReady, query, results, setQuery } = useGlobalSearch();

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
                        className='absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center bg-black/60 backdrop-blur-sm md:py-16'
                    >
                        <motion.input
                            initial={{ opacity: 0, y: -20, scaleX: 0 }}
                            animate={{ opacity: 1, y: [20, 0], scaleX: 1 }}
                            exit={{ opacity: 0, y: -20, scaleX: 0 }}
                            onBlur={() => setIsActive(false)}
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
                            className='flex h-10 w-full max-w-xl rounded-full border border-input bg-background px-6 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        />

                        {results.length > 0 && (
                            <div className='w-full max-w-xl'>
                                {results.map((result) => (
                                    <div
                                        key={result.url}
                                        className='w-full p-4'
                                    >
                                        <h3 className='text-lg font-semibold text-foreground'>
                                            {reactParser(result.title)}
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>
                                            {reactParser(
                                                result.content
                                                    .join('')
                                                    .toString(),
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
export default GlobalSearch;
