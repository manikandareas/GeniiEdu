import HeaderOptions from '@/common/components/elements/HeaderOptions';

type GeniiChatPageProps = {};

const urls = [
    {
        name: 'Dashboard',
        href: '/dashboard',
    },
    {
        name: 'Genii Chat',
        href: '/genii-chat',
    },
];

const GeniiChatPage: React.FC<GeniiChatPageProps> = () => {
    return (
        <>
            <HeaderOptions title='Genii Chat' urls={urls} />
            <main className='px-6'>Hello From Genii Chat Page</main>
        </>
    );
};
export default GeniiChatPage;
