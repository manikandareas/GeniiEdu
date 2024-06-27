import { fakerId } from '../libs/Faker';

const generateStudent = () => ({
    id: fakerId.string.uuid(),
    name: fakerId.person.fullName(),
    username: fakerId.internet.userName(),
    email: fakerId.internet.email(),
    profilePicture: fakerId.image.avatar(),
});

export const generateDummyStudents = (count: number) =>
    Array.from({ length: count }, generateStudent);

export const DUMMY_STUDENTS = [
    {
        id: 'd3f1296d-77d1-475f-b1e3-9bdbbd36bda7',
        name: 'Jailani Marwata',
        username: 'Asirwanda.Gerhold61',
        email: 'Ajimat_Rath@yahoo.co.id',
        profilePicture: 'https://avatars.githubusercontent.com/u/91725260',
    },
    {
        id: '9d651e10-a6ff-4073-8336-7b5e90528956',
        name: 'Kusuma Yulia',
        username: 'Vicky_Fisher12',
        email: 'Surya.Strosin93@gmail.com',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1232.jpg',
    },
    {
        id: '00aad784-77b0-4aca-a8ae-0dead30e0d8d',
        name: 'Uyainah Nurul',
        username: 'Purwa_Nienow26',
        email: 'Nasab4@yahoo.com',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/621.jpg',
    },
    {
        id: '2d74c79a-7df9-4327-b7d7-ff4d196f24ff',
        name: 'Mahfud Mahfud Ahmad',
        username: 'Rahmawati71',
        email: 'Laksana72@gmail.co.id',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/93.jpg',
    },
    {
        id: '4c878f4f-699a-4d75-aaac-3a158122397a',
        name: 'Karsana Iswahyudi',
        username: 'Maida.Witting1',
        email: 'Galiono.Borer@gmail.co.id',
        profilePicture: 'https://avatars.githubusercontent.com/u/33192160',
    },
    {
        id: '25f33e55-623d-42d2-a1f3-d76bcb4ef0db',
        name: 'Chandra Chandra Hutasoit',
        username: 'Baktianto44',
        email: 'Mursita_Tromp@gmail.co.id',
        profilePicture: 'https://avatars.githubusercontent.com/u/41880201',
    },
    {
        id: '1cd2deb2-932c-42ff-9542-aa0777bcab00',
        name: 'Pangeran Haikal',
        username: 'Cengkal11',
        email: 'Mala.Spinka@gmail.com',
        profilePicture: 'https://avatars.githubusercontent.com/u/54207997',
    },
    {
        id: '8afc71c7-dcb2-4db7-bffa-db12e11c8524',
        name: 'Siti Siti Agustina',
        username: 'Prita48',
        email: 'Tasnim6@yahoo.com',
        profilePicture: 'https://avatars.githubusercontent.com/u/70104818',
    },
    {
        id: 'b8eaa263-2411-4cbd-9770-072e2f89a0e7',
        name: 'Hari Perdana',
        username: 'Jinawi51',
        email: 'Samsul57@gmail.com',
        profilePicture: 'https://avatars.githubusercontent.com/u/35436170',
    },
    {
        id: '23988cee-e6c8-48b4-be9f-7cd2121d3dad',
        name: 'Sabrina Anandya',
        username: 'Abyasa.Bradtke',
        email: 'Limar_Bosco@gmail.co.id',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/894.jpg',
    },
    {
        id: 'abae711c-0a77-49a8-82e8-6f3bea1aa071',
        name: 'Chelsea Mahestri',
        username: 'Rendy66',
        email: 'Viman_McCullough78@gmail.com',
        profilePicture: 'https://avatars.githubusercontent.com/u/29362048',
    },
    {
        id: 'ff1f6600-ab6a-431a-a5a6-5afbd4f49ab4',
        name: 'Devi Devi Fujiati',
        username: 'Puji_Schowalter12',
        email: 'Malika51@gmail.com',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1123.jpg',
    },
    {
        id: 'bae397da-1ae6-41ae-8f02-3ce9dd67a7c8',
        name: 'Yono Yono Prasetya',
        username: 'Aditya_Armstrong72',
        email: 'Enteng71@yahoo.co.id',
        profilePicture: 'https://avatars.githubusercontent.com/u/10199179',
    },
    {
        id: '97a8348d-6be0-47d2-835b-5ff309ce649b',
        name: 'Maida Palastri',
        username: 'Prabawa.Koch62',
        email: 'Harsaya_Harris68@yahoo.co.id',
        profilePicture: 'https://avatars.githubusercontent.com/u/22087565',
    },
    {
        id: '26e58471-192a-44ce-ae2e-6a216371ed31',
        name: 'Carla Carla Jelita',
        username: 'Irfan_Maggio15',
        email: 'Hartaka.Cremin@gmail.com',
        profilePicture: 'https://avatars.githubusercontent.com/u/52883416',
    },
    {
        id: 'dd7dc6c9-ed57-477b-b9ce-6398047669bb',
        name: 'Ahmad Daliono',
        username: 'Tedi99',
        email: 'Restu_Rempel@gmail.co.id',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/184.jpg',
    },
    {
        id: '5b85a0a2-6d45-4fbe-a88d-e351dac517cb',
        name: 'Mumpuni Natsir',
        username: 'Warta.Ortiz',
        email: 'Upik_Kunze@gmail.co.id',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/660.jpg',
    },
    {
        id: '0e7d49a4-3dcd-41f2-8cac-0dcebd677019',
        name: 'Winarsih Agustina',
        username: 'Salimah50',
        email: 'Martana.Connelly66@gmail.co.id',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1224.jpg',
    },
    {
        id: '3fbd1105-973b-4cd5-b93f-d2e5fa3bf857',
        name: 'Silvia Silvia Azizah',
        username: 'Emil_Steuber',
        email: 'Arta_Farrell99@yahoo.com',
        profilePicture: 'https://avatars.githubusercontent.com/u/17187008',
    },
    {
        id: '0157f639-d4d2-4a4f-97cd-91e296594b57',
        name: 'Olivia Kusmawati',
        username: 'Cemplunk11',
        email: 'Zulfa.Hand@gmail.co.id',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/907.jpg',
    },
    {
        id: '5e6b0369-0e04-4de2-856e-d0c52afc132f',
        name: 'Pangeran Rendra',
        username: 'Marsito_Tromp',
        email: 'Darmana_Schneider@yahoo.com',
        profilePicture: 'https://avatars.githubusercontent.com/u/69708916',
    },
    {
        id: 'bf399cf0-8f09-4f75-8a31-1896787c8771',
        name: 'Sherly Namaga',
        username: 'Argono_DuBuque',
        email: 'Gaman8@gmail.co.id',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/175.jpg',
    },
    {
        id: '7e3fdbc1-8709-423b-ac5f-42494424d11d',
        name: 'Marsito Marsito Faresta',
        username: 'Simon_Stoltenberg',
        email: 'Bala_Price35@yahoo.com',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/828.jpg',
    },
    {
        id: 'ce48418b-a453-411f-afaf-00ca285d2af8',
        name: 'Rendy Rendy Pangestu',
        username: 'Gandewa_Quitzon',
        email: 'Budi.OConnell@gmail.com',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1135.jpg',
    },
    {
        id: '99c54f4d-7bb9-4080-a68e-85e1178b8bca',
        name: 'Patricia Patricia Lailasari',
        username: 'Jaeman_Lockman',
        email: 'Kajen_Nikolaus86@gmail.co.id',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/579.jpg',
    },
    {
        id: '80581ed6-9b9e-43fc-a00e-1fdf0d38b81b',
        name: 'Himawan Gibran',
        username: 'Vera.Powlowski14',
        email: 'Cinta_Fritsch@gmail.co.id',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/542.jpg',
    },
    {
        id: '2cd7ff76-b83e-481c-a527-43c3b4e71dc9',
        name: 'Edward Saragih',
        username: 'Gatra_Marvin89',
        email: 'Rahman_Kessler@gmail.com',
        profilePicture: 'https://avatars.githubusercontent.com/u/98573843',
    },
    {
        id: 'a8714534-2648-401f-8498-6a8920028055',
        name: 'Yono Darmawan',
        username: 'Aris_OConnell',
        email: 'Nyoman_OKeefe@gmail.com',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/650.jpg',
    },
    {
        id: '0974e886-8d56-4922-812f-05ac8b83abca',
        name: 'Sadina Sadina Maryati',
        username: 'Elvin_Corkery',
        email: 'Oskar_Rutherford@gmail.co.id',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/314.jpg',
    },
    {
        id: '804acb89-40ee-44a9-8666-35a80635d28d',
        name: 'Aswandi Kasusra',
        username: 'Cagak.Nolan78',
        email: 'Dalimin58@gmail.com',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/49.jpg',
    },
    {
        id: 'f30d78dc-1a3a-4bc6-aa6a-bd327e6a5fbf',
        name: 'Adriansyah Gamblang',
        username: 'Vino_Spencer28',
        email: 'Ganda.Bechtelar-Mertz54@yahoo.com',
        profilePicture: 'https://avatars.githubusercontent.com/u/64982879',
    },
    {
        id: '0b2fe423-fc8c-464e-a35b-953572f1cf33',
        name: 'Melani Ida',
        username: 'Halima_Wisoky29',
        email: 'Victoria_Hickle3@gmail.co.id',
        profilePicture:
            'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/358.jpg',
    },
];
