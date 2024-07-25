'use client';

import { Input } from '@/common/components/ui/input';
import { useInputGradeStorage } from '@/common/hooks/input-grade-storage';
import { cn } from '@/common/libs/utils';
import { useEffect, useRef } from 'react';
import { useInputGradeContext } from './input-grade-context';

type InputGradeProps = {
    id: string;
    defaultValue?: string | null;
};

const InputGrade: React.FC<InputGradeProps> = ({ id, defaultValue }) => {
    const { grades, setGrades } = useInputGradeContext();
    const gradeRef = useRef<HTMLInputElement>(null);
    const { localValue, setLocalValue } = useInputGradeStorage();

    const onGradeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^[0-9]{1,3}$/;

        if (e.target.value === '') {
            setGrades((prev) => {
                return prev.filter((item) => item.id !== id);
            });

            return;
        }

        if (!regex.test(e.target.value)) {
            return;
        }

        const grade = parseInt(e.target.value, 10);

        if (grade > 100) {
            return;
        }

        setGrades((prev) => {
            return prev
                .filter((item) => item.id !== id)
                .concat({ grade, id, isGraded: false });
        });
    };

    const gradeValue = grades.find((item) => item.id === id) ?? null;

    useEffect(() => {
        if (localValue.length > 0) {
            setGrades(localValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Hanya dijalankan sekali saat komponen di-mount

    useEffect(() => {
        if (grades.length > 0) {
            setLocalValue(grades);
        }
    }, [grades, setLocalValue]); // Fungsi cleanup dijalankan saat komponen di-unmount

    return (
        <div className='relative'>
            <Input
                ref={gradeRef}
                className={cn('w-20', {
                    'text-yellow-500': gradeValue?.grade,
                    'text-green-500': !!defaultValue,
                    'text-blue-500':
                        !!defaultValue &&
                        gradeValue?.grade &&
                        defaultValue !== gradeValue?.grade.toString(),
                })}
                maxLength={3}
                onChange={onGradeChanged}
                // defaultValue={defaultValue ?? ''}
                // disabled={!!defaultValue}
                value={gradeValue?.grade || defaultValue || ''}
            />
            <span className='absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                /100
            </span>
        </div>
    );
};
export default InputGrade;
