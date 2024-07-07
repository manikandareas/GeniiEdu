import Typography from '@/common/components/ui/typography';
import DetailsAssignment from '../DetailsAssignment';
import SubmissionSection from './SubmissionSection';

type StudentSectionProps = {};

const StudentSection: React.FC<StudentSectionProps> = () => {
    return (
        <div className='flex w-full flex-col gap-4 px-6 md:flex-row md:justify-center md:gap-4 2xl:px-0'>
            <DetailsAssignment />
            <SubmissionSection />
        </div>
    );
};
export default StudentSection;
