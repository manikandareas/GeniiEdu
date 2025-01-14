import { DEFAULT_PROFILE } from './default-profile';

export const DUMMY_ACTIVITIES = [
    {
        id: 1,
        className: 'Pemrograman Web',
        teacher: 'Sandika Galih',
        activity: 'Added new assignment',
        date: new Date().toLocaleDateString('ID'),
        profilePicture: DEFAULT_PROFILE.profilePicture,
    },
    {
        id: 1,
        className: 'Mathematics',
        teacher: 'Jerome Polin',
        activity: 'Deadline approaching',
        date: new Date().toLocaleDateString('ID'),
        profilePicture: DEFAULT_PROFILE.profilePicture,
    },
    {
        id: 1,
        className: 'Pemrograman Berorientasi Objek',
        teacher: 'Aldy Sambur',
        activity: 'Added new materials',
        date: new Date().toLocaleDateString('ID'),
        profilePicture: DEFAULT_PROFILE.profilePicture,
    },
    {
        id: 1,
        className: 'UI/UX Design',
        teacher: 'Abizar Saputra',
        activity: 'Deadline approaching',
        date: new Date().toLocaleDateString('ID'),
        profilePicture: DEFAULT_PROFILE.profilePicture,
    },
];
