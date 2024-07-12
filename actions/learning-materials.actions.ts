'use server';

import { findClassBySlug, isOwnerOfClass } from '@/common/data-access/classes';
import {
    findDetailsLearningMaterial,
    insertLearningMaterial,
    insertLearningMaterialFiles,
} from '@/common/data-access/learning-materials';

import { createTransaction } from '@/common/data-access/utils';
import { ActionError, teacherProcedure } from '@/common/libs/safe-action';
import { LearningMaterialsModel } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
import { revalidatePath } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import * as z from 'zod';

export const createLearningMaterial = teacherProcedure
    .metadata({
        actionName: 'createLearningMaterial',
    })
    .bindArgsSchemas<[classSlug: z.ZodString]>([z.string()])
    .schema(LearningMaterialsModel.insertLearningMaterialsSchema)
    .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [classSlug] }) => {
        const { user } = ctx;

        await createTransaction(async (tx) => {
            const existingClass = await isOwnerOfClass(user.id, classSlug);

            if (!existingClass) {
                throw new ActionError('You are not the owner of this class');
            }

            const insertedLearningMaterial = await insertLearningMaterial(
                {
                    title: parsedInput.title,
                    content: sanitizeHtml(parsedInput.content),
                    authorId: user.id,
                    publishedAt: parsedInput.publishedAt,
                    classId: existingClass.id,
                },
                { tx },
            );

            if (insertedLearningMaterial.length === 0) {
                tx.rollback();
                throw new ActionError('Failed to create learning material');
            }

            // ? Insert learning material files if they exist
            if (parsedInput.files && parsedInput.files.length > 0) {
                // @ts-ignore
                const mappedFiles = parsedInput.files.map((file) => ({
                    learningMaterialId: insertedLearningMaterial[0].id,
                    fileId: file.id,
                }));

                //   ? Insert files relations
                const insertedLearningMaterialFiles =
                    await insertLearningMaterialFiles(mappedFiles, {
                        tx,
                    });

                if (insertedLearningMaterialFiles.length === 0) {
                    tx.rollback();
                    throw new ActionError(
                        'Failed to create learning material files',
                    );
                }
            }

            revalidatePath(`/class/${classSlug}`);
        });
        return {
            success: true,
            message: 'Learning material created successfully',
        } satisfies ActRes;
    });

export const getDetailsLearningMaterial = async (materialId: string) => {
    return await findDetailsLearningMaterial(materialId);
};
