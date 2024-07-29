import useSearchParamsState from '@/common/hooks/useSearchParamsState';
import { SubmissionsAssignment } from './Columns';
import PreviewSubmissionCard from './preview-submission-card';
import DetailsSubmission from './details-submission';

type PreviewSubmissionsProps = {
    submissions: SubmissionsAssignment[];
};

const PreviewSubmissions: React.FC<PreviewSubmissionsProps> = ({
    submissions,
}) => {
    const { searchParams } = useSearchParamsState();
    return (
        <>
            {!!!searchParams.get('sb') ? (
                <div className='grid gap-4 lg:grid-cols-2 xl:grid-cols-4'>
                    {submissions.map((item) => (
                        <PreviewSubmissionCard key={item.id} {...item} />
                    ))}
                </div>
            ) : (
                <div className='flex flex-col gap-4'>
                    {submissions
                        .filter((item) => item.id === searchParams.get('sb'))
                        .map((item) => (
                            <DetailsSubmission key={item.id} data={item} />
                        ))}
                </div>
            )}
        </>
    );
};
export default PreviewSubmissions;
