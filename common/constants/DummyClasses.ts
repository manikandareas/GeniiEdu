export const dummyClasses: {
    className: string;
    classCode: string;
    description: string;
    teacherId: string;
    slug: string;
    accessType: 'public' | 'private';
    thumbnail: string;
}[] = [
    {
        className: 'Web Development',
        classCode: 'PWE2024',
        description:
            'You will learn how to develop user-friendly websites and applications and adapt them to different devices. You will understand how to create strong products. Master a sought-after speciality and be able to increase your income.',
        teacherId: '01903b15-a3fd-7a29-a31d-3ce42e16aabd',
        slug: 'web-development',
        accessType: 'public',
        thumbnail: 'https://picsum.photos/1600/900?random=1',
    },
    {
        className: 'Introduction to Data Science',
        classCode: 'IDS2024',
        description:
            'Learn the basics of data science including data analysis, visualization, and machine learning. Gain the skills needed to understand and work with large data sets.',
        teacherId: '01903b15-a3fd-7a29-a31d-3ce42e16aabd',
        slug: 'introduction-to-data-science',
        accessType: 'private',
        thumbnail: 'https://picsum.photos/1600/900?random=2',
    },
    {
        className: 'Digital Marketing',
        classCode: 'DM2024',
        description:
            'Explore the latest strategies in digital marketing. Learn how to create compelling campaigns and understand key metrics to track success.',
        teacherId: '01903b15-a3fd-7a29-a31d-3ce42e16aabd',
        slug: 'digital-marketing',
        accessType: 'public',
        thumbnail: 'https://picsum.photos/1600/900?random=3',
    },
    {
        className: 'Introduction to Psychology',
        classCode: 'PSY101',
        description:
            'An overview of psychological concepts and theories. Understand human behavior, development, and mental processes.',
        teacherId: '01903b15-a3fd-7a29-a31d-3ce42e16aabd',
        slug: 'introduction-to-psychology',
        accessType: 'private',
        thumbnail: 'https://picsum.photos/1600/900?random=4',
    },
    {
        className: 'Graphic Design Basics',
        classCode: 'GDB101',
        description:
            'Learn the fundamentals of graphic design, including typography, color theory, and layout design. Create your own visual content.',
        teacherId: '01903b15-a3fd-7a29-a31d-3ce42e16aabd',
        slug: 'graphic-design-basics',
        accessType: 'public',
        thumbnail: 'https://picsum.photos/1600/900?random=5',
    },
    {
        className: 'Business Management',
        classCode: 'BM2024',
        description:
            'Gain insights into business management practices. Learn about leadership, strategy, and organizational behavior to improve business performance.',
        teacherId: '01903b15-a3fd-7a29-a31d-3ce42e16aabd',
        slug: 'business-management',
        accessType: 'private',
        thumbnail: 'https://picsum.photos/1600/900?random=6',
    },
    {
        className: 'Creative Writing',
        classCode: 'CW101',
        description:
            'Develop your creative writing skills in this introductory course. Explore various genres, learn storytelling techniques, and improve your writing craft.',
        teacherId: '01903b15-a3fd-7a29-a31d-3ce42e16aabd',
        slug: 'creative-writing',
        accessType: 'public',
        thumbnail: 'https://picsum.photos/1600/900?random=7',
    },
    {
        className: 'Introduction to Java Programming',
        classCode: 'JAVA101',
        description:
            'Start your journey into Java programming. Learn the basics of Java syntax, control structures, and object-oriented programming.',
        teacherId: '01903b15-a3fd-7a29-a31d-3ce42e16aabd',
        slug: 'introduction-to-java-programming',
        accessType: 'private',
        thumbnail: 'https://picsum.photos/1600/900?random=8',
    },
    {
        className: 'Advanced Excel',
        classCode: 'EXC2024',
        description:
            'Master advanced Excel techniques. Learn about data analysis, complex formulas, pivot tables, and automation through VBA.',
        teacherId: '01903b15-a3fd-7a29-a31d-3ce42e16aabd',
        slug: 'advanced-excel',
        accessType: 'public',
        thumbnail: 'https://picsum.photos/1600/900?random=9',
    },
    {
        className: 'Project Management Essentials',
        classCode: 'PME2024',
        description:
            'Understand the principles of project management. Learn how to plan, execute, and close projects effectively using modern methodologies.',
        teacherId: '01903b15-a3fd-7a29-a31d-3ce42e16aabd',
        slug: 'project-management-essentials',
        accessType: 'private',
        thumbnail: 'https://picsum.photos/1600/900?random=10',
    },
];

export const dummyThumbnail = dummyClasses.map((cls, index) => ({
    id: `image_${index + 1}`,
    url: cls.thumbnail,
    key: cls.slug,
    userId: cls.teacherId, // Menggunakan teacherId sebagai uploadedBy untuk contoh ini
}));

// Langkah 2: Memperbarui dummyClasses dengan thumbnail id
export const updatedDummyClasses = dummyClasses.map((cls, index) => ({
    ...cls,
    thumbnailId: dummyThumbnail[index].id,
}));

// Output hasil
console.log('dummyThumbnail:', dummyThumbnail);
console.log('updatedDummyClasses:', updatedDummyClasses);
