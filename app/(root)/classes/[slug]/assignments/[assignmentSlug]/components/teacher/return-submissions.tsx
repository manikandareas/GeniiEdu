'use client';

import { submitGrades } from '@/actions/submissions.actions';
import { Button } from '@/common/components/ui/button';
import {
    detailsAssignmentQuery,
    useDetailsAssignmentQuery,
} from '@/common/hooks/details-assignment-query';
import { useInputGradeStorage } from '@/common/hooks/input-grade-storage';
import useCurrentUser from '@/common/hooks/useCurrentUser';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { useInputGradeContext } from './input-grade-context';
import { useQueryClient } from '@tanstack/react-query';

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
