import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/common/components/ui/tabs';
import DetailsAssignment from '../details-assignment';
import { FindDetailsAssignmentForTeacherResponse } from '@/common/data-access/assignments';
import StudentAssignmentsContent from './student-assignments-content';

type TeacherSectionProps = {
    initialData: FindDetailsAssignmentForTeacherResponse;
};

const TeacherSection: React.FC<TeacherSectionProps> = ({ initialData }) => {
    return (
        <main className='w-full px-4 py-4 md:px-6 md:py-0'>
            <Tabs defaultValue='studentAssignment' className=''>
                <TabsList className='mb-2'>
                    <TabsTrigger value='details'>Details</TabsTrigger>
                    <TabsTrigger value='studentAssignment'>
                        Student Assignment
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='details'>
                    <DetailsAssignment
                        initialData={initialData}
                        className='mx-auto'
                    />
                </TabsContent>
                <TabsContent value='studentAssignment'>
                    <StudentAssignmentsContent initialData={initialData} />
                </TabsContent>
            </Tabs>
        </main>
    );
};
export default TeacherSection;
