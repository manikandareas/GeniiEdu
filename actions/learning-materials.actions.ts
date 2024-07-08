'use server';

import { findClassBySlug } from '@/common/data-access/classes';
import {
    insertLearningMaterial,
    insertLearningMaterialFiles,
} from '@/common/data-access/learning-materials';

import { createTransaction } from '@/common/data-access/utils';
import { teacherProcedure } from '@/common/libs/safe-action';
import { LearningMaterialsModel } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
import * as z from 'zod';

export const createLearningMaterial = teacherProcedure
    .metadata({
        actionName: 'createLearningMaterial',
    })
    .bindArgsSchemas<[classSlug: z.ZodString]>([z.string()])
    .schema(LearningMaterialsModel.insertLearningMaterialsSchema)
    .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [classSlug] }) => {
        try {
            const { user } = ctx;

            await createTransaction(async (tx) => {
                const existingClass = await findClassBySlug(classSlug);

                if (!existingClass) {
                    throw new Error('Class not found');
                }

                // ? Insert learning material
                const insertedLearningMaterial = await insertLearningMaterial(
                    {
                        title: parsedInput.title,
                        content: parsedInput.content,
                        authorId: user.id,
                        publishedAt: parsedInput.publishedAt,
                        classId: existingClass.id,
                    },
                    { tx },
                );

                if (insertedLearningMaterial.length === 0) {
                    tx.rollback();
                    throw new Error('Failed to create learning material');
                }

                console.log('Success insert learning material');

                // ? Insert learning material files if they exist
                if (parsedInput.files && parsedInput.files.length > 0) {
                    // @ts-ignore
                    const mappedFiles = parsedInput.files.map((file) => ({
                        learningMaterialId: insertedLearningMaterial[0].id,
                        fileId: file.id,
                    }));

                    //   ? Insert relations files
                    const insertedLearningMaterialFiles =
                        await insertLearningMaterialFiles(mappedFiles, {
                            tx,
                        });

                    if (insertedLearningMaterialFiles.length === 0) {
                        tx.rollback();
                        throw new Error(
                            'Failed to create learning material files',
                        );
                    }

                    console.log('Success insert learning material files');
                }
            });
            return {
                success: true,
                message: 'Learning material created successfully',
            } satisfies ActRes;
        } catch (error: any) {
            console.log(JSON.stringify(error, null, 2));
            return {
                success: false,
                error: error.message,
            } satisfies ActRes;
        }
    });
