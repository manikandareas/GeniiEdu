import Typography from '@/common/components/ui/typography';
import DetailsAssignment from '../details-assignment';
import SubmissionAssignment from './submission-assignment';

type StudentSectionProps = {};

const StudentSection: React.FC<StudentSectionProps> = () => {
    return (
        <div className='flex w-full flex-col gap-4 px-6 md:flex-row md:justify-center md:gap-4 2xl:px-0'>
            <DetailsAssignment />
            <SubmissionAssignment />
        </div>
    );
};
export default StudentSection;
