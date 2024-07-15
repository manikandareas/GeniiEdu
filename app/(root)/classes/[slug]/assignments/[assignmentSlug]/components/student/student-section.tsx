import { FindDetailsAssignmentForStudentResponse } from '@/common/data-access/assignments';
import DetailsAssignment from '../details-assignment';
import SubmissionAssignment from './submission-assignment';

type StudentSectionProps = {
    data: FindDetailsAssignmentForStudentResponse;
};

const StudentSection: React.FC<StudentSectionProps> = ({ data }) => {
    return (
        <div className='flex w-full flex-col gap-4 px-6 md:flex-row md:justify-center md:gap-4 2xl:px-0'>
            <DetailsAssignment data={data} />
            <SubmissionAssignment data={data} />
        </div>
    );
};
export default StudentSection;
