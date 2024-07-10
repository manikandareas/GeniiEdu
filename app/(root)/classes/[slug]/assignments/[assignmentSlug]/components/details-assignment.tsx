import Typography from '@/common/components/ui/typography';
import MaterialHeader from '../../../_components/material-header';
import { ComponentProps, ElementType } from 'react';
import { cn } from '@/common/libs/utils';

type DetailsAssignmentProps = ComponentProps<'main'>;

const DetailsAssignment: React.FC<DetailsAssignmentProps> = ({ className }) => {
    return (
        <main
            className={cn(
                'min-h-[30vh] w-full max-w-4xl border-b md:border-none',
                className,
            )}
        >
            <MaterialHeader
                authorName='Manik'
                icon='assignment'
                title='UAS Pemrograman Web'
                createdAt='23 Apr'
            />

            <section className='space-y-4 px-4 py-4 md:px-14'>
                <Typography variant={'p'}>
                    Uas Pemrograman Web dalam mata kuliah Pemrograman Web
                </Typography>
            </section>
        </main>
    );
};
export default DetailsAssignment;
