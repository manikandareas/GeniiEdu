import { useLocalStorage } from 'usehooks-ts';

export const useInputGradeStorage = () => {
    const [localValue, setLocalValue, removeLocalValue] = useLocalStorage<
        { grade: number | null; id: string; isGraded: boolean }[]
    >('geniiEdu/grades', []);

    return { localValue, setLocalValue, removeLocalValue };
};
