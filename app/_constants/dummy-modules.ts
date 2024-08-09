interface Module {
    moduleName: string;
    moduleCode: string;
    description: string;
}

interface Class {
    className: string;
    classCode: string;
    description: string;
    teacherId: string;
    slug: string;
    accessType: 'public' | 'private';
    thumbnail: string;
    modules: Module[];
}

export const DUMMY_CLASSES: Class[] = [
    {
        className: 'Web Development',
        classCode: 'PWE2024',
        description:
            'You will learn how to develop user-friendly websites and applications and adapt them to different devices. You will understand how to create strong products. Master a sought-after speciality and be able to increase your income.',
        teacherId: '01903b15-a3fd-7a29-a31d-3ce42e16aabd',
        slug: 'web-development',
        accessType: 'public',
        thumbnail: 'https://picsum.photos/1600/900?random=1',
        modules: [
            {
                moduleName: 'HTML & CSS Basics',
                moduleCode: 'WD101',
                description:
                    'Learn the basics of HTML and CSS to create static web pages.',
            },
            {
                moduleName: 'JavaScript Fundamentals',
                moduleCode: 'WD102',
                description:
                    'Understand the fundamentals of JavaScript to add interactivity to web pages.',
            },
            {
                moduleName: 'Responsive Design',
                moduleCode: 'WD103',
                description:
                    'Learn how to create responsive designs that work on different devices.',
            },
        ],
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
        modules: [
            {
                moduleName: 'Data Analysis with Python',
                moduleCode: 'DS101',
                description:
                    'Learn how to analyze data using Python libraries like Pandas and NumPy.',
            },
            {
                moduleName: 'Data Visualization',
                moduleCode: 'DS102',
                description:
                    'Understand how to visualize data using tools like Matplotlib and Seaborn.',
            },
            {
                moduleName: 'Introduction to Machine Learning',
                moduleCode: 'DS103',
                description:
                    'Get an introduction to basic machine learning concepts and algorithms.',
            },
        ],
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
        modules: [
            {
                moduleName: 'SEO Basics',
                moduleCode: 'DM101',
                description:
                    'Learn the fundamentals of Search Engine Optimization.',
            },
            {
                moduleName: 'Social Media Marketing',
                moduleCode: 'DM102',
                description:
                    'Understand how to leverage social media platforms for marketing.',
            },
            {
                moduleName: 'Email Marketing',
                moduleCode: 'DM103',
                description:
                    'Learn how to create effective email marketing campaigns.',
            },
        ],
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
        modules: [
            {
                moduleName: 'Foundations of Psychology',
                moduleCode: 'PSY101',
                description:
                    'Learn the basic concepts and theories in psychology.',
            },
            {
                moduleName: 'Developmental Psychology',
                moduleCode: 'PSY102',
                description:
                    'Understand the psychological development across the lifespan.',
            },
            {
                moduleName: 'Abnormal Psychology',
                moduleCode: 'PSY103',
                description:
                    'Study the patterns and causes of abnormal behavior.',
            },
        ],
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
        modules: [
            {
                moduleName: 'Typography',
                moduleCode: 'GD101',
                description:
                    'Learn about different typefaces and how to use them effectively.',
            },
            {
                moduleName: 'Color Theory',
                moduleCode: 'GD102',
                description:
                    'Understand the principles of color and how to apply them in design.',
            },
            {
                moduleName: 'Layout Design',
                moduleCode: 'GD103',
                description:
                    'Learn how to create balanced and effective layouts.',
            },
        ],
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
        modules: [
            {
                moduleName: 'Leadership',
                moduleCode: 'BM101',
                description:
                    'Learn about different leadership styles and how to apply them.',
            },
            {
                moduleName: 'Strategic Management',
                moduleCode: 'BM102',
                description:
                    'Understand how to develop and implement business strategies.',
            },
            {
                moduleName: 'Organizational Behavior',
                moduleCode: 'BM103',
                description:
                    'Study how individuals and groups behave within organizations.',
            },
        ],
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
        modules: [
            {
                moduleName: 'Fiction Writing',
                moduleCode: 'CW101',
                description:
                    'Learn the basics of writing fiction, including plot and character development.',
            },
            {
                moduleName: 'Poetry Writing',
                moduleCode: 'CW102',
                description:
                    'Explore different forms of poetry and how to write them.',
            },
            {
                moduleName: 'Non-Fiction Writing',
                moduleCode: 'CW103',
                description:
                    'Understand the techniques of writing non-fiction, including memoir and essays.',
            },
        ],
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
        modules: [
            {
                moduleName: 'Java Basics',
                moduleCode: 'JAVA101',
                description:
                    'Learn the basic syntax and structure of Java programs.',
            },
            {
                moduleName: 'Object-Oriented Programming',
                moduleCode: 'JAVA102',
                description:
                    'Understand the principles of object-oriented programming in Java.',
            },
            {
                moduleName: 'Java Development Tools',
                moduleCode: 'JAVA103',
                description:
                    'Get introduced to tools like Eclipse and IntelliJ IDEA for Java development.',
            },
        ],
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
        modules: [
            {
                moduleName: 'Advanced Formulas',
                moduleCode: 'EXC101',
                description:
                    'Learn how to use complex formulas and functions in Excel.',
            },
            {
                moduleName: 'Pivot Tables',
                moduleCode: 'EXC102',
                description:
                    'Understand how to use pivot tables for data analysis.',
            },
            {
                moduleName: 'Excel VBA',
                moduleCode: 'EXC103',
                description: 'Learn how to automate tasks in Excel using VBA.',
            },
        ],
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
        modules: [
            {
                moduleName: 'Project Planning',
                moduleCode: 'PM101',
                description:
                    'Learn how to create effective project plans and timelines.',
            },
            {
                moduleName: 'Project Execution',
                moduleCode: 'PM102',
                description:
                    'Understand the key aspects of executing projects successfully.',
            },
            {
                moduleName: 'Project Closure',
                moduleCode: 'PM103',
                description:
                    'Learn how to close projects and document lessons learned.',
            },
        ],
    },
];
