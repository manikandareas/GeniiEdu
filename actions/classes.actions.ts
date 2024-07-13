'use server';

import { insertClassMember } from '@/common/data-access/class-members';
import {
    findClassByCode,
    findClassBySlug,
    findDetailsClass,
    findStudentInClass,
    insertClass,
} from '@/common/data-access/classes';
import {
    findFileByKey,
    insertFile,
    patchFiles,
} from '@/common/data-access/files';
import {
    ActionError,
    studentProcedure,
    teacherProcedure,
} from '@/common/libs/safe-action';
import { ClassesModel } from '@/common/models';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// * Actions running expectedly
export const createClass = teacherProcedure
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

        const { user: teacher } = ctx;

        const [existingClassBySlug, existingClassByClassCode] =
            await Promise.all([
                await findClassBySlug(parsedInput.slug),
                await findClassByCode(parsedInput.classCode),
            ]);

        if (existingClassBySlug) {
            throw new ActionError(
                'Slug is already exists, please modify it. or you can modify the class name to change the default slug.',
            );
        }

        if (existingClassByClassCode) {
            throw new ActionError(
                'Class code is already used, please modify it.',
            );
        }

        let classThumbnailId = null;

        // ? Upload default thumbnail to database if not provided
        if (!parsedInput.thumbnailKey && parsedInput.thumbnail) {
            const [uploadedDefaultThumbnail] = await insertFile({
                url: parsedInput.thumbnail,
                key: parsedInput.slug,
                userId: teacher.id,
                type: 'image',
                name: parsedInput.className,
            });

            classThumbnailId = uploadedDefaultThumbnail.id;
        } else if (parsedInput.thumbnailKey && parsedInput.thumbnail) {
            // ? Get inserted thumbnail id from database
            const classThumbnail = await findFileByKey(
                parsedInput.thumbnailKey,
            );

            classThumbnailId = classThumbnail?.id;
        } else {
            throw new ActionError('Something went wrong, please try again.');
        }

        if (!classThumbnailId) {
            throw new ActionError('Something went wrong, please try again.');
        }

        const [insertedClass] = await insertClass({
            className: parsedInput.className,
            slug: parsedInput.slug,
            description: parsedInput.description,
            teacherId: teacher.id,
            classCode: parsedInput.classCode,
            accessType: parsedInput.accessType,
        });

        if (!insertedClass) {
            throw new ActionError('Something went wrong, please try again.');
        }

        await insertClassMember({
            classId: insertedClass.id,
            userId: teacher.id,
            role: 'teacher',
        });

        await patchFiles(classThumbnailId, {
            classId: insertedClass.id,
        });

        revalidatePath('/classes');
        return {
            message: `Class ${parsedInput.className} created successfully`,
        };
    });

// * Actions running expectedly
const uploadClassThumbnailSchema = z.object({
    url: z.string().url(),
    key: z.string(),
});
export const uploadClassThumbnail = teacherProcedure
    .metadata({
        actionName: 'uploadClassThumbnail',
    })
    .schema(uploadClassThumbnailSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { user } = ctx;

        const response = await insertFile({
            url: parsedInput.url,
            key: parsedInput.key,
            type: 'image',
            userId: user.id,
            name: parsedInput.key,
        });

        if (response.length === 0) {
            throw new ActionError(
                'Something went wrong when upload thumbnail, please try again.',
            );
        }

        return {
            message: 'Thumbnail uploaded successfully',
        };
    });

export const getDetailsClass = async (slug: string) => {
    const existingClass = await findDetailsClass(slug);

    if (!existingClass) {
        throw new ActionError('Class not found');
    }

    return {
        data: existingClass,
    };
};
export type GetDetailsClassResponse = Awaited<
    ReturnType<typeof getDetailsClass>
>;

// * Actions running expectedly
export const joinClass = studentProcedure
    .metadata({
        actionName: 'joinClass',
    })
    .schema(ClassesModel.joinClassSchema)
    .action(async ({ parsedInput, ctx }) => {
        const { user: student } = ctx;

        const classToJoin = await findClassByCode(parsedInput.classCode);

        if (!classToJoin) {
            throw new ActionError('Class not found');
        }

        const isStudentAlreadyInClass = await findStudentInClass(
            student.id,
            classToJoin.id,
        );

        if (isStudentAlreadyInClass) {
            throw new ActionError('Your already in this class');
        }

        await insertClassMember({
            classId: classToJoin.id,
            userId: student.id,
            role: 'student',
        });

        revalidatePath('/classes');

        return {
            message: `Welcome to ${classToJoin.className}🎊`,
        };
    });
