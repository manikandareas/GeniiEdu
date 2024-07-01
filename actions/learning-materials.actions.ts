'use server';

import {
    getMaximumPositionMaterial,
    insertLearningMaterial,
    insertLearningMaterialFiles,
    insertMaterialModule,
} from '@/common/data-access/learning-materials';
import { findModuleBySlug } from '@/common/data-access/module';
import db from '@/common/libs/DB';
import { teacherProcedure } from '@/common/libs/safe-action';
import { LearningMaterialsModel, Schema } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const createLearningMaterial = teacherProcedure
    .metadata({
        actionName: 'createLearningMaterial',
    })
    .schema(LearningMaterialsModel.insertLearningMaterialsSchema)
    .bindArgsSchemas<[slug: z.ZodString]>([z.string()])
    .action(
        async ({ parsedInput, ctx, bindArgsParsedInputs: [moduleSlug] }) => {
            try {
                const { user } = ctx;

                return await db.transaction(async (tx) => {
                    // ? Find module
                    const existingModule = await findModuleBySlug(moduleSlug, {
                        tx,
                    });

                    if (!existingModule) {
                        tx.rollback();
                        throw new Error('Module not found');
                    }
                    console.log('Module exists');

                    // ? Insert learning material
                    const insertedLearningMaterial =
                        await insertLearningMaterial(
                            {
                                title: parsedInput.title,
                                content: parsedInput.content,
                                postedById: user.id,
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

                    const maxPositionResult = await getMaximumPositionMaterial(
                        existingModule.id,
                        {
                            tx,
                        },
                    );

                    const maxPosition = maxPositionResult[0].maxPosition;
                    const nextPosition =
                        maxPosition !== null ? (maxPosition as number) + 1 : 0;

                    // ? Bind learning material to module
                    const linkedLearningMaterialModule =
                        await insertMaterialModule(
                            {
                                materialId: insertedLearningMaterial[0].id,
                                moduleId: existingModule.id,
                                position: nextPosition,
                            },
                            { tx },
                        );

                    if (linkedLearningMaterialModule.length === 0) {
                        tx.rollback();
                        throw new Error(
                            'Failed to link learning material to module',
                        );
                    }

                    revalidatePath(`/modules/${moduleSlug}`);

                    return {
                        success: true,
                        data: insertedLearningMaterial[0],
                        message: 'Learning material created successfully',
                    } satisfies ActRes;
                });
            } catch (error: any) {
                console.log(JSON.stringify(error, null, 2));
                return {
                    success: false,
                    error: error.message,
                } satisfies ActRes;
            }
        },
    );
