'use client';

import { submitGrades } from '@/app/_actions/submissions-actions';
import { Button } from '@/app/_components/ui/button';
import useCurrentUser from '@/app/_hooks/current-user';
import { useInputGradeStorage } from '@/app/_hooks/input-grade-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { useInputGradeContext } from './input-grade-context';

type ReturnSubmissionsProps = {
    assignmentId: string;
};

const ReturnSubmissions: React.FC<ReturnSubmissionsProps> = ({
    assignmentId,
}) => {
    const { grades, setGrades } = useInputGradeContext();
    const user = useCurrentUser();
    const queryClient = useQueryClient();
    const { removeLocalValue } = useInputGradeStorage();

    const { executeAsync, isExecuting } = useAction(submitGrades, {
        onSuccess: ({ data }) => {
            toast.success(data?.message);
            setGrades([]);
            removeLocalValue();
            queryClient.invalidateQueries({
                queryKey: [
                    'details-assignment',
                    assignmentId,
                    user?.id,
                    user?.role,
                ],
            });
        },
        onError: ({ error }) => {
            toast.error(error.serverError);
        },
    });
    const onReturnClicked = async () => {
        await executeAsync(
            grades.map((grade) => ({
                grade: grade.grade!,
                id: grade.id,
            })),
        );
    };
    return (
        <Button
            disabled={isExecuting || grades.length === 0}
            onClick={onReturnClicked}
        >
            {isExecuting ? 'Submitting...' : 'Return Submissions'}
        </Button>
    );
};
export default ReturnSubmissions;
