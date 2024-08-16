import React, { Suspense } from 'react';
import DetailsAssignment from '../details-assignment';
import PersonalComments from './personal-comments';
import SubmissionAssignment from './submission-assignment';
import { InferReturnType } from '@/app/_data-access/types';
import assignmentsData from '@/app/_data-access/assignments';
import { GetDetailsAssignmentResponse } from '@/app/_actions/assignments-actions';

namespace StudentSection {
    export type Props = {
        initialData: GetDetailsAssignmentResponse;
    };
}

const StudentSection: React.FC<StudentSection.Props> = ({ initialData }) => {
    return (
        <div className='flex w-full flex-col gap-4 px-6 md:flex-row md:justify-center md:gap-4 2xl:px-0'>
            <DetailsAssignment initialData={initialData} />
            <aside className='mx-auto w-full max-w-sm space-y-4 md:mx-0'>
                <SubmissionAssignment initialData={initialData} />
                <PersonalComments assignmentId={initialData?.id as string} />
            </aside>
        </div>
    );
};
export default StudentSection;
