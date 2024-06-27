'use server';

import { LearningMaterialsModel, Schema } from '@/common/models';
import { teacherActionClient } from '.';
import { ActRes } from '@/common/types/Action.type';
import db from '@/common/libs/DB';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

export const createLearningMaterial = teacherActionClient
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
                    const existingModule = await tx.query.modules.findFirst({
                        where: eq(Schema.modules.slug, moduleSlug),
                    });

                    if (!existingModule) {
                        tx.rollback();
                        throw new Error('Module not found');
                    }
                    console.log('Module exists');

                    // ? Insert learning material
                    const insertedLearningMaterial = await tx
                        .insert(Schema.learningMaterials)
                        .values({
                            title: parsedInput.title,
                            content: parsedInput.content,
                            postedById: user.id,
                        })
                        .returning();

                    if (insertedLearningMaterial.length === 0) {
                        tx.rollback();
                        throw new Error('Failed to create learning material');
                    }

                    console.log('Success insert learning material');

                    // ? Insert learning material files if they exist
                    if (parsedInput.files && parsedInput.files.length > 0) {
                        //   ? Insert relations files
                        const insertedLearningMaterialFiles = await tx
                            .insert(Schema.learningMaterialFiles)
                            .values(
                                parsedInput.files.map((file) => ({
                                    learningMaterialId:
                                        insertedLearningMaterial[0].id,
                                    fileId: file.id,
                                })),
                            );

                        if (insertedLearningMaterialFiles.count === 0) {
                            tx.rollback();
                            throw new Error(
                                'Failed to create learning material files',
                            );
                        }

                        console.log('Success insert learning material files');
                    }

                    const maxPositionResult = await tx
                        .select({
                            maxPosition: sql`MAX(${Schema.materialModules.position}) AS maxPosition`,
                        })
                        .from(Schema.materialModules)
                        .where(
                            eq(
                                Schema.materialModules.moduleId,
                                existingModule.id,
                            ),
                        );

                    const maxPosition = maxPositionResult[0].maxPosition;
                    const nextPosition =
                        maxPosition !== null ? (maxPosition as number) + 1 : 0;

                    // ? Bind learning material to module
                    const linkedLearningMaterialModule = await tx
                        .insert(Schema.materialModules)
                        .values({
                            materialId: insertedLearningMaterial[0].id,
                            moduleId: existingModule.id,
                            position: nextPosition,
                        });

                    if (linkedLearningMaterialModule.count === 0) {
                        tx.rollback();
                        throw new Error(
                            'Failed to link learning material to module',
                        );
                    }

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
