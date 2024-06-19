import {
    boolean,
    numeric,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { uuidv7 } from 'uuidv7';

// ? Defining Database Schemas

const customUniqueID = (identifier: string, size: number = 15) =>
    `${identifier}${nanoid(size)}`;

export const RoleEnum = pgEnum('role', ['teacher', 'student']);
export const ClassAccessTypeEnum = pgEnum('class_access_type', [
    'public',
    'private',
]);
export const createdAt = timestamp('created_at', {
    mode: 'string',
}).defaultNow();
export const updatedAt = timestamp('updated_at', {
    mode: 'string',
}).defaultNow();

export const users = pgTable('users', {
    id: text('user_id')
        .$defaultFn(() => uuidv7())
        .primaryKey(),
    name: text('name'), // +
    username: text('username'), // +
    email: text('email').unique(),
    passwordHash: text('password_hash'),
    role: RoleEnum('role'), // +
    profilePicture: text('profile_picture'),
    bio: text('bio'),
    isEmailVerified: boolean('is_email_verified').default(false),
    onBoardingComplete: boolean('on_boarding_complete').default(false),
    createdAt,
    updatedAt,
});

export const oauthAccounts = pgTable('oauth_accounts', {
    id: text('id')
        .$defaultFn(() => uuidv7())
        .primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    provider: text('provider').notNull(), // google, github
    providerUserId: text('provider_user_id').notNull(),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date',
    }),
});

export const emailVerifications = pgTable('email_verifications', {
    id: serial('email_verification_id').primaryKey(),
    userId: text('user_id')
        .references(() => users.id)
        .notNull(),
    code: text('code').notNull(),
    sentAt: createdAt,
});

export const sessions = pgTable('sessions', {
    id: text('session_id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),
});

export const notifications = pgTable('notifications', {
    id: serial('notification_id').primaryKey(),
    message: text('message').notNull(),
    isRead: boolean('is_read').default(false),
    userId: text('user_id')
        .references(() => users.id)
        .notNull(),
    createdAt,
});

export const classes = pgTable('classes', {
    id: text('class_id')
        .$defaultFn(() => customUniqueID('class_'))
        .primaryKey(),
    className: text('class_name').notNull(),
    slug: text('slug').unique().notNull(),
    description: text('description'),
    classCode: text('class_code').notNull(),
    teacherId: text('teacher_id')
        .references(() => users.id)
        .notNull(),
    accessType: ClassAccessTypeEnum('access_type').default('private'),
    thumbnail: text('thumbnail').references(() => images.id),
    createdAt,
    updatedAt,
});

export const classMembers = pgTable('class_members', {
    id: serial('class_member_id').primaryKey(),
    userId: text('user_id')
        .references(() => users.id)
        .notNull(),
    classId: text('class_id')
        .references(() => classes.id)
        .notNull(),
    joinedAt: createdAt,
});

export const announcements = pgTable('announcements', {
    id: serial('announcement_id').primaryKey(),
    classId: text('class_id')
        .references(() => classes.id)
        .notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    postedAt: createdAt,
    postedBy: text('posted_by')
        .references(() => users.id)
        .notNull(),
});

export const assignments = pgTable('assignments', {
    id: text('assignment_id')
        .$defaultFn(() => customUniqueID('assignment_'))
        .primaryKey(),
    classId: text('class_id')
        .references(() => classes.id)
        .notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    dueDate: timestamp('due_date'),
    createdAt,
    updatedAt,
});

export const submissions = pgTable('submissions', {
    id: text('submission_id')
        .$defaultFn(() => customUniqueID('submission_'))
        .primaryKey(),
    assignmentId: text('assignment_id')
        .references(() => assignments.id)
        .notNull(),
    filePath: text('file_path').notNull(),
    studentId: text('student_id')
        .references(() => users.id)
        .notNull(),
    submittedAt: createdAt,
    grade: numeric('grade'),
    feedback: text('feedback'),
    gradedAt: timestamp('graded_at'),
});

export const learningMaterials = pgTable('learning_materials', {
    id: text('material_id')
        .$defaultFn(() => customUniqueID('material_'))
        .primaryKey(),
    classId: text('class_id')
        .references(() => classes.id)
        .notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    filePath: text('file_path').notNull(),
    uploadedBy: text('uploaded_by').references(() => users.id),
    uploadedAt: createdAt,
});

export const materialFolders = pgTable('material_folders', {
    id: serial('material_folder_id').primaryKey(),
    materialId: text('material_id').references(() => learningMaterials.id),
    folderId: text('folder_id').references(() => folders.id),
});

export const folders = pgTable('folders', {
    id: text('folder_id')
        .$defaultFn(() => customUniqueID('folder_'))
        .primaryKey(),
    folderName: text('folder_name').notNull(),
    classId: text('class_id')
        .references(() => classes.id)
        .notNull(),
    //   parentFolderId: text("parent_folder_id").references(() => folders.id),
    createdAt,
    updatedAt,
});

export const images = pgTable('images', {
    id: text('image_id')
        .$defaultFn(() => customUniqueID('image_'))
        .primaryKey(),
    filePath: text('file_path').notNull(),
    key: text('key').unique().notNull(),
    uploadedBy: text('uploaded_by').references(() => users.id),
    createdAt,
    updatedAt,
});

// ? Defining Database Relations

export const usersRelations = relations(users, ({ many }) => ({
    notifications: many(notifications),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id],
    }),
}));

export const classMembersRelations = relations(classMembers, ({ one }) => ({
    user: one(users, {
        fields: [classMembers.userId],
        references: [users.id],
    }),
    class: one(classes, {
        fields: [classMembers.classId],
        references: [classes.id],
    }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
    teacher: one(users, {
        fields: [classes.teacherId],
        references: [users.id],
    }),
    thumbnail: one(images, {
        fields: [classes.thumbnail],
        references: [images.id],
    }),
    members: many(classMembers),
    announcements: many(announcements),
    assignments: many(assignments),
    learningMaterials: many(learningMaterials),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
    postedBy: one(users, {
        fields: [announcements.postedBy],
        references: [users.id],
    }),
    class: one(classes, {
        fields: [announcements.classId],
        references: [classes.id],
    }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
    class: one(classes, {
        fields: [assignments.classId],
        references: [classes.id],
    }),
    submissions: many(submissions),
}));

export const learningMaterialsRelations = relations(
    learningMaterials,
    ({ one }) => ({
        uploadedBy: one(users, {
            fields: [learningMaterials.uploadedBy],
            references: [users.id],
        }),
        class: one(classes, {
            fields: [learningMaterials.classId],
            references: [classes.id],
        }),
    }),
);

export const materialFoldersRelations = relations(
    materialFolders,
    ({ one }) => ({
        material: one(learningMaterials, {
            fields: [materialFolders.materialId],
            references: [learningMaterials.id],
        }),
        folder: one(folders, {
            fields: [materialFolders.folderId],
            references: [folders.id],
        }),
    }),
);

// export const foldersRelations = relations(folders, ({ many }) => ({
//   materials: many(learningMaterials),
// }));

export const submissionsRelations = relations(submissions, ({ one }) => ({
    student: one(users, {
        fields: [submissions.studentId],
        references: [users.id],
    }),
    assignment: one(assignments, {
        fields: [submissions.assignmentId],
        references: [assignments.id],
    }),
}));

export const imagesRelations = relations(images, ({ one }) => ({
    uploadedBy: one(users, {
        fields: [images.uploadedBy],
        references: [users.id],
    }),
}));

// ? Defining Zod Schemas

import { relations } from 'drizzle-orm';
