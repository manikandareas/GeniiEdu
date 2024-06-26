'use server';

import db from '@/common/libs/DB';
import { ClassesModel, Schema } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { authActionClient, studentActionClient, teacherActionClient } from '.';
import { revalidatePath } from 'next/cache';

// * Actions running expectedly
export const createClass = teacherActionClient
    .metadata({
        actionName: 'createClass',
    })
    .schema(ClassesModel.createClassSchema)
    .action(async ({ parsedInput, ctx }) => {
        if (!parsedInput.slug) {
            parsedInput.slug = parsedInput.className
                .replace(/\s+/g, '-')
                .toLowerCase();
        }

        try {
            const { user: teacher } = ctx;

            const [existingClassBySlug, existingClassByClassCode] =
                await Promise.all([
                    db.query.classes.findFirst({
                        where: eq(Schema.classes.slug, parsedInput.slug),
                    }),
                    await db.query.classes.findFirst({
                        where: eq(
                            Schema.classes.classCode,
                            parsedInput.classCode,
                        ),
                    }),
                ]);

            if (existingClassBySlug) {
                throw new Error(
                    'Slug is already exists, please modify it. or you can modify the class name to change the default slug.',
                );
            }

            if (existingClassByClassCode) {
                throw new Error(
                    'Class code is already used, please modify it.',
                );
            }

            let classThumbnailId = null;

            // ? Upload default thumbnail to database if not provided
            if (!parsedInput.thumbnailKey && parsedInput.thumbnail) {
                const uploadedDefaultThumbnail = await db
                    .insert(Schema.files)
                    .values({
                        url: parsedInput.thumbnail,
                        key: parsedInput.slug,
                        userId: teacher.id,
                    })
                    .returning({
                        id: Schema.files.id,
                    });

                classThumbnailId = uploadedDefaultThumbnail[0].id;
            } else if (parsedInput.thumbnailKey && parsedInput.thumbnail) {
                // ? Get inserted thumbnail id from database
                const classThumbnail = await db.query.files.findFirst({
                    where: eq(Schema.files.key, parsedInput.thumbnailKey),
                });

                classThumbnailId = classThumbnail?.id;
            } else {
                throw new Error('Something went wrong, please try again.');
            }

            if (!classThumbnailId) {
                throw new Error('Something went wrong, please try again.');
            }

            const insertedClass = await db
                .insert(Schema.classes)
                .values({
                    className: parsedInput.className,
                    slug: parsedInput.slug,
                    description: parsedInput.description,
                    teacherId: teacher.id,
                    classCode: parsedInput.classCode,
                    accessType: parsedInput.accessType,
                    thumbnailId: classThumbnailId,
                })
                .returning({
                    slug: Schema.classes.slug,
                });

            if (!insertedClass) {
                throw new Error('Something went wrong, please try again.');
            }

            return {
                success: true,
                message: `Class ${parsedInput.className} created successfully`,
                data: {
                    slug: insertedClass[0].slug,
                },
            } satisfies ActRes<{ slug: string }>;
        } catch (error: any) {
            return {
                error: error.message,
                success: false,
            } satisfies ActRes;
        }
    });

// * Actions running expectedly
const uploadClassThumbnailSchema = z.object({
    url: z.string().url(),
    key: z.string(),
});
export const uploadClassThumbnail = teacherActionClient
    .metadata({
        actionName: 'uploadClassThumbnail',
    })
    .schema(uploadClassThumbnailSchema)
    .action(async ({ parsedInput, ctx }) => {
        try {
            const { user } = ctx;

            const response = await db.insert(Schema.files).values({
                url: parsedInput.url,
                key: parsedInput.key,
                type: 'image',
                userId: user.id,
            });

            if (response.count === 0) {
                throw new Error('Something went wrong, please try again.');
            }

            return {
                success: true,
                message: 'Thumbnail uploaded successfully',
            } satisfies ActRes;
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            } satisfies ActRes;
        }
    });

// * Actions running expectedly
export const findClassBySlug = authActionClient
    .metadata({
        actionName: 'findClassBySlug',
    })
    .schema(z.string())
    .action(async ({ parsedInput: slug }) => {
        try {
            const existingClass = await db.query.classes.findFirst({
                where: eq(Schema.classes.slug, slug),
                with: {
                    thumbnail: true,
                    teacher: true,
                },
            });

            if (!existingClass) {
                throw new Error('Class not found');
            }
            return {
                success: true,
                data: existingClass,
            } satisfies ActRes;
        } catch (error: any) {
            return {
                error: error.message,
                success: false,
            } satisfies ActRes;
        }
    });

// * Actions running expectedly
export const joinClass = studentActionClient
    .metadata({
        actionName: 'joinClass',
    })
    .schema(ClassesModel.joinClassSchema)
    .action(async ({ parsedInput, ctx }) => {
        try {
            const { user: student } = ctx;

            const classToJoin = await db.query.classes.findFirst({
                where: eq(Schema.classes.classCode, parsedInput.classCode),
            });

            if (!classToJoin) {
                throw new Error('Class not found');
            }

            const isStudentAlreadyInClass =
                await db.query.classMembers.findFirst({
                    where: and(
                        eq(Schema.classMembers.classId, classToJoin.id),
                        eq(Schema.classMembers.userId, student.id),
                    ),
                });

            if (isStudentAlreadyInClass) {
                throw new Error('Your already in this class');
            }

            await db.insert(Schema.classMembers).values({
                classId: classToJoin.id,
                userId: student.id,
            });

            revalidatePath('/classes');

            return {
                success: true,
                message: `Welcome to ${classToJoin.className}🎊`,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            } satisfies ActRes;
        }
    });
