'use server';

import { GlobalSearch } from '@/app/_providers/flex-search-provider';
import assignmentsData from '@/app/_data-access/assignments';
import classMembersData from '@/app/_data-access/class-members';
import classesData from '@/app/_data-access/classes';
import filesData from '@/app/_data-access/files';
import usersData from '@/app/_data-access/users';
import {
    ActionError,
    studentProcedure,
    teacherProcedure,
} from '@/app/_libs/safe-action';
import {
    addClassValidation,
    joinClassValidation,
} from '@/app/_validations/classes-validation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { InferResultType, InferReturnType } from '../_data-access/types';

// * Actions running expectedly
export const createClass = teacherProcedure
    .metadata({
        actionName: 'createClass',
    })
    .schema(addClassValidation)
    .action(async ({ parsedInput, ctx }) => {
        if (!parsedInput.slug) {
            parsedInput.slug = parsedInput.className
                .replace(/\s+/g, '-')
                .toLowerCase();
        }

        const { user: teacher } = ctx;

        const [existingClassBySlug, existingClassByClassCode] =
            await Promise.all([
                await classesData.findOneBySlug(parsedInput.slug),
                await classesData.findOneByCode(parsedInput.classCode),
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
            const [uploadedDefaultThumbnail] = await filesData.create({
                url: parsedInput.thumbnail,
                key: parsedInput.slug,
                userId: teacher.id,
                type: 'image',
                name: parsedInput.className,
            });

            classThumbnailId = uploadedDefaultThumbnail.id;
        } else if (parsedInput.thumbnailKey && parsedInput.thumbnail) {
            // ? Get inserted thumbnail id from database
            const classThumbnail = await filesData.findOneByKey(
                parsedInput.thumbnailKey,
            );

            classThumbnailId = classThumbnail?.id;
        } else {
            throw new ActionError('Something went wrong, please try again.');
        }

        if (!classThumbnailId) {
            throw new ActionError('Something went wrong, please try again.');
        }

        const insertedClass = await classesData.create({
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

        await classMembersData.create({
            classId: insertedClass.id,
            userId: teacher.id,
            role: 'teacher',
        });

        await filesData.patch(classThumbnailId, {
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

        const response = await filesData.create({
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
    const existingClass = await classesData.findOneBySlug(slug, {
        queryConfig: {
            with: classesData.detailsQuery,
        },
    });

    if (!existingClass) {
        throw new ActionError('Class not found');
    }

    return {
        data: existingClass as unknown as GetDetailsClassResponse['data'],
    };
};
export type GetDetailsClassResponse = {
    data: InferResultType<'classes', typeof classesData.detailsQuery>;
};

// * Actions running expectedly
export const joinClass = studentProcedure
    .metadata({
        actionName: 'joinClass',
    })
    .schema(joinClassValidation)
    .action(async ({ parsedInput, ctx }) => {
        const { user: student } = ctx;

        const classToJoin = await classesData.findOneByCode(
            parsedInput.classCode,
        );

        if (!classToJoin) {
            throw new ActionError('Class not found');
        }

        const isStudentAlreadyInClass =
            await classMembersData.findOneWhereUserIdAndClassId(
                student.id,
                classToJoin.id,
            );

        if (isStudentAlreadyInClass) {
            throw new ActionError('Your already in this class');
        }

        await classMembersData.create({
            classId: classToJoin.id,
            userId: student.id,
            role: 'student',
        });

        revalidatePath('/classes');

        return {
            message: `Welcome to ${classToJoin.className}🎊`,
        };
    });

export const getClassesForSearch = async (userId: string) => {
    return (await classMembersData.findForSearch(userId)) as GlobalSearch[];
};

export const getUpcomingTasks = async (classId: string) => {
    return await assignmentsData.findUpcomingTasks(classId);
};
