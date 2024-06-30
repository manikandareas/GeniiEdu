import { relations } from 'drizzle-orm';
import {
    boolean,
    integer,
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

// Enums
export const RoleEnum = pgEnum('role', ['teacher', 'student']);
export const ClassAccessTypeEnum = pgEnum('class_access_type', [
    'public',
    'private',
]);
export const ClassCompletionStatusEnum = pgEnum('class_completion_status', [
    'ongoing',
    'completed',
    'archived',
]);
export const StudentProgressTypeEnum = pgEnum('student_progress_type', [
    'assignment_completion',
    'material_view',
]);

export const FilesTypeEnum = pgEnum('files_type', [
    'image',
    'video',
    'pdf',
    'youtube',
]);

export type FileTypes = keyof typeof FilesTypeEnum;

// Common Fields
export const createdAt = timestamp('created_at', {
    withTimezone: true,
}).defaultNow();
export const updatedAt = timestamp('updated_at', {
    withTimezone: true,
}).defaultNow();

// Users Table
export const users = pgTable('users', {
    id: text('user_id')
        .primaryKey()
        .$defaultFn(() => uuidv7()),
    name: text('name'),
    username: text('username').unique(),
    email: text('email').unique(),
    passwordHash: text('password_hash'),
    role: RoleEnum('role'),
    profilePicture: text('profile_picture'),
    bio: text('bio'),
    isEmailVerified: boolean('is_email_verified').default(false).notNull(),
    onBoardingComplete: boolean('on_boarding_complete')
        .default(false)
        .notNull(),
    createdAt,
    updatedAt,
});

// User Contacts Table
export const userContacts = pgTable('user_contacts', {
    id: serial('user_contact_id').primaryKey(),
    userId: text('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    instagram: text('instagram'),
    twitter: text('twitter'),
    github: text('github'),
    linkedin: text('linkedin'),
    website: text('website'),
    whatsapp: text('whatsapp'),
    facebook: text('facebook'),
    createdAt,
    updatedAt,
});

// OAuth Accounts Table
export const oauthAccounts = pgTable('oauth_accounts', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => uuidv7()),
    userId: text('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    provider: text('provider').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt,
    updatedAt,
});

// Email Verifications Table
export const emailVerifications = pgTable('email_verifications', {
    id: serial('email_verification_id').primaryKey(),
    userId: text('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    code: text('code').notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt,
    updatedAt,
});

// Sessions Table
export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    expiresAt: timestamp('expires_at', {
        withTimezone: true,
        mode: 'date',
    }).notNull(),
});

// Notifications Table
export const notifications = pgTable('notifications', {
    id: serial('notification_id').primaryKey(),
    message: text('message').notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    userId: text('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt,
    updatedAt,
});

// Classes Table
export const classes = pgTable('classes', {
    id: text('class_id')
        .primaryKey()
        .$defaultFn(() => uuidv7()),
    className: text('class_name').notNull(),
    slug: text('slug').unique().notNull(),
    description: text('description'),
    classCode: text('class_code').notNull(),
    teacherId: text('teacher_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    accessType: ClassAccessTypeEnum('access_type').default('private').notNull(),
    thumbnailId: text('thumbnail_id').references(() => files.id),
    createdAt,
    updatedAt,
});

// Class Members Table
export const classMembers = pgTable('class_members', {
    id: serial('class_member_id').primaryKey(),
    userId: text('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    classId: text('class_id')
        .references(() => classes.id, { onDelete: 'cascade' })
        .notNull(),
    statusCompletion: ClassCompletionStatusEnum('status_completion')
        .default('ongoing')
        .notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt,
});

// Announcements Table
export const announcements = pgTable('announcements', {
    id: serial('announcement_id').primaryKey(),
    classId: text('class_id')
        .references(() => classes.id, { onDelete: 'cascade' })
        .notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    postedAt: timestamp('posted_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    postedById: text('posted_by_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    updatedAt,
});

//  Assignments Table
export const assignments = pgTable('assignments', {
    id: text('assignment_id')
        .primaryKey()
        .$defaultFn(() => uuidv7()),
    title: text('title').notNull(),
    description: text('description').notNull(),
    filePath: text('file_path'),
    postedById: text('posted_by_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt,
    updatedAt,
});

// Assignment Modules Table
export const assignmentModules = pgTable('assignment_modules', {
    id: serial('assignment_module_id').primaryKey(),
    assignmentId: text('assignment_id')
        .references(() => assignments.id, { onDelete: 'cascade' })
        .notNull(),
    moduleId: text('module_id')
        .references(() => modules.id, { onDelete: 'cascade' })
        .notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    dueDate: timestamp('due_date', { withTimezone: true }),
    createdAt,
    updatedAt,
});

// Learning Materials Table
export const learningMaterials = pgTable('learning_materials', {
    id: text('material_id')
        .primaryKey()
        .$defaultFn(() => uuidv7()),
    title: text('title').notNull(),
    content: text('content').notNull(),
    postedById: text('posted_by_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt,
    updatedAt,
});

export const learningMaterialFiles = pgTable('learning_material_files', {
    id: serial('learning_material_file_id').primaryKey(),
    learningMaterialId: text('learning_material_id')
        .references(() => learningMaterials.id, { onDelete: 'cascade' })
        .notNull(),
    fileId: text('file_id')
        .references(() => files.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt,
    updatedAt,
});

// Material Modules Table
export const materialModules = pgTable('material_modules', {
    id: serial('material_module_id').primaryKey(),
    materialId: text('material_id')
        .references(() => learningMaterials.id, { onDelete: 'cascade' })
        .notNull(),
    moduleId: text('module_id')
        .references(() => modules.id, { onDelete: 'cascade' })
        .notNull(),
    position: integer('position').notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),

    createdAt,
    updatedAt,
});

// Modules Table
export const modules = pgTable('modules', {
    id: text('module_id')
        .primaryKey()
        .$defaultFn(() => uuidv7()),
    moduleName: text('module_name').notNull(),
    description: text('description'),
    slug: text('slug').unique().notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    authorId: text('author_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    createdAt,
    updatedAt,
});

// Class Modules Table -> attach modules to classes
export const classModules = pgTable('class_modules', {
    id: serial('class_module_id').primaryKey(),
    classId: text('class_id')
        .references(() => classes.id, { onDelete: 'cascade' })
        .notNull(),
    moduleId: text('module_id')
        .references(() => modules.id, { onDelete: 'cascade' })
        .notNull(),
    position: integer('position').notNull(),
    isPublished: boolean('is_published').default(false).notNull(),
    createdAt,
    updatedAt,
});

// Images Table
export const files = pgTable('files', {
    id: text('file_id')
        .primaryKey()
        .$defaultFn(() => uuidv7()),
    url: text('url').notNull(),
    key: text('key').notNull(),
    name: text('name').notNull(),
    type: FilesTypeEnum('type').notNull().default('image'),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt,
});

// Submissions Table
export const submissions = pgTable('submissions', {
    id: text('submission_id')
        .primaryKey()
        .$defaultFn(() => uuidv7()),
    assignmentId: text('assignment_id')
        .references(() => assignments.id, { onDelete: 'cascade' })
        .notNull(),
    studentId: text('student_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    filePath: text('file_path'),
    isGraded: boolean('is_graded').default(false).notNull(),
    grade: numeric('grade'),
    submittedAt: timestamp('submitted_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt,
});

// Student Progress Table
export const studentProgress = pgTable('student_progress', {
    id: serial('student_progress_id').primaryKey(),
    studentId: text('student_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    classId: text('class_id').references(() => classes.id, {
        onDelete: 'cascade',
    }),
    materialId: text('material_id').references(() => learningMaterials.id, {
        onDelete: 'cascade',
    }),
    assignmentId: text('assignment_id').references(() => assignments.id, {
        onDelete: 'cascade',
    }),
    progressType: StudentProgressTypeEnum('progress_type').notNull(),
    createdAt,
    updatedAt,
});

/**
 * Relations
 */
export const usersRelations = relations(users, ({ one, many }) => ({
    userContacts: one(userContacts, {
        fields: [users.id],
        references: [userContacts.userId],
    }),
    classes: many(classes),
    announcements: many(announcements),
    submissions: many(submissions),
    studentProgress: many(studentProgress),
}));

export const userContactsRelations = relations(userContacts, ({ one }) => ({
    user: one(users, { fields: [userContacts.userId], references: [users.id] }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
    teacher: one(users, {
        fields: [classes.teacherId],
        references: [users.id],
    }),
    thumbnail: one(files, {
        fields: [classes.thumbnailId],
        references: [files.id],
    }),
    members: many(classMembers),
    announcements: many(announcements),
    classModules: many(classModules),
    studentProgress: many(studentProgress),
}));

export const classMembersRelations = relations(classMembers, ({ one }) => ({
    user: one(users, { fields: [classMembers.userId], references: [users.id] }),
    class: one(classes, {
        fields: [classMembers.classId],
        references: [classes.id],
    }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
    class: one(classes, {
        fields: [announcements.classId],
        references: [classes.id],
    }),
    postedBy: one(users, {
        fields: [announcements.postedById],
        references: [users.id],
    }),
}));

export const assignmentsRelations = relations(assignments, ({ many, one }) => ({
    modules: many(assignmentModules),
    submissions: many(submissions),
    studentProgress: many(studentProgress),
    uploadedBy: one(users, {
        fields: [assignments.postedById],
        references: [users.id],
    }),
}));

export const assignmentModulesRelations = relations(
    assignmentModules,
    ({ one }) => ({
        assignment: one(assignments, {
            fields: [assignmentModules.assignmentId],
            references: [assignments.id],
        }),
        module: one(modules, {
            fields: [assignmentModules.moduleId],
            references: [modules.id],
        }),
    }),
);

export const learningMaterialsRelations = relations(
    learningMaterials,
    ({ one, many }) => ({
        uploadedBy: one(users, {
            fields: [learningMaterials.postedById],
            references: [users.id],
        }),
        modules: many(materialModules),
        studentProgress: many(studentProgress),
        files: many(learningMaterialFiles),
    }),
);

export const learningMaterialsFilesRelations = relations(
    learningMaterialFiles,
    ({ one }) => ({
        material: one(learningMaterials, {
            fields: [learningMaterialFiles.learningMaterialId],
            references: [learningMaterials.id],
        }),
        file: one(files, {
            fields: [learningMaterialFiles.fileId],
            references: [files.id],
        }),
    }),
);

export const materialModulesRelations = relations(
    materialModules,
    ({ one }) => ({
        material: one(learningMaterials, {
            fields: [materialModules.materialId],
            references: [learningMaterials.id],
        }),
        module: one(modules, {
            fields: [materialModules.moduleId],
            references: [modules.id],
        }),
    }),
);

export const modulesRelations = relations(modules, ({ many, one }) => ({
    materials: many(materialModules),
    assignments: many(assignmentModules),
    classModules: many(classModules),
    author: one(users, { fields: [modules.authorId], references: [users.id] }),
}));

export const classModulesRelations = relations(classModules, ({ one }) => ({
    class: one(classes, {
        fields: [classModules.classId],
        references: [classes.id],
    }),
    module: one(modules, {
        fields: [classModules.moduleId],
        references: [modules.id],
    }),
}));

export const filesRelations = relations(files, ({ one }) => ({
    user: one(users, { fields: [files.userId], references: [users.id] }),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
    assignment: one(assignments, {
        fields: [submissions.assignmentId],
        references: [assignments.id],
    }),
    student: one(users, {
        fields: [submissions.studentId],
        references: [users.id],
    }),
}));

export const studentProgressRelations = relations(
    studentProgress,
    ({ one }) => ({
        student: one(users, {
            fields: [studentProgress.studentId],
            references: [users.id],
        }),
        class: one(classes, {
            fields: [studentProgress.classId],
            references: [classes.id],
        }),
        material: one(learningMaterials, {
            fields: [studentProgress.materialId],
            references: [learningMaterials.id],
        }),
        assignment: one(assignments, {
            fields: [studentProgress.assignmentId],
            references: [assignments.id],
        }),
    }),
);

export type FilesType = typeof files._.inferInsert;
