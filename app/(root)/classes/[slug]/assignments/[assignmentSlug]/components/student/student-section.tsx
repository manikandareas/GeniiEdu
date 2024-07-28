import { FindDetailsAssignmentForStudentResponse } from '@/common/data-access/assignments';
import React from 'react';
import DetailsAssignment from '../details-assignment';
import PersonalComments from './personal-comments';
import SubmissionAssignment from './submission-assignment';

export namespace StudentSection {
    export type Props = {
        data: FindDetailsAssignmentForStudentResponse;
    };
}

const StudentSection: React.FC<StudentSection.Props> = ({ data }) => {
    return (
        <div className='flex w-full flex-col gap-4 px-6 md:flex-row md:justify-center md:gap-4 2xl:px-0'>
            <DetailsAssignment data={data} />
            <aside className='mx-auto w-full max-w-sm space-y-4 md:mx-0'>
                <SubmissionAssignment data={data} />
                <PersonalComments assignmentId={data?.id as string} />
            </aside>
        </div>
    );
};
export default StudentSection;
