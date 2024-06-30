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

            <iframe
                width='560'
                height='315'
                src='https://www.youtube.com/embed/8hhaAsRFAJs?si=2k7Cs3mOUwOoQVys'
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
            ></iframe>
        </>
    );
};
export default GeniiChatPage;

// https://youtu.be/8hhaAsRFAJs?si=2k7Cs3mOUwOoQVys
