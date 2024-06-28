import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Returns an object with a `handleChange` function that updates the search parameters
 * in the URL based on the provided key and term.
 *
 * @returns {Object} An object with a `handleChange` function.
 * @param {string} key - The key of the search parameter to update.
 * @param {string} term - The new value of the search parameter.
 */
const useSearchParamsState = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleChange = (key: string, term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set(key, term);
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return {
        handleChange,
        searchParams
    };
};

export default useSearchParamsState;
