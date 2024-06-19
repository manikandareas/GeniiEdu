import { findClassBySlug } from '@/actions/classes.actions';
import { notFound } from 'next/navigation';

type DetailClassPageProps = {
    params: {
        slug: string;
    };
};

const DetailClassPage: React.FC<DetailClassPageProps> = async ({ params }) => {
    const response = await findClassBySlug(params.slug);

    if (!response?.data) throw new Error('Something went wrong');

    const { data } = response;

    if (!data.success) return notFound();

    return <pre>{JSON.stringify(data.data, null, 2)}</pre>;
};
export default DetailClassPage;
