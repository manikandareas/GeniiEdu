'use server';

import classesData from '@/app/_data-access/classes';
import filesData from '@/app/_data-access/files';
import materialsData from '@/app/_data-access/materials';
import notificationsData from '@/app/_data-access/notifications';

import { createTransaction } from '@/app/_data-access/utils';
import { Goreal } from '@/app/_libs/goreal';
import { ActionError, teacherProcedure } from '@/app/_libs/safe-action';
import { addMaterialValidation } from '@/app/_validations/materials-validation';
import { revalidatePath } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import * as z from 'zod';
import { classMembers } from '../_libs/db/schema';
import classMembersData from '../_data-access/class-members';

export const createLearningMaterial = teacherProcedure
    .metadata({
        actionName: 'createLearningMaterial',
    })
    .bindArgsSchemas<[classSlug: z.ZodString]>([z.string()])
    .schema(addMaterialValidation)
    .action(async ({ parsedInput, ctx, bindArgsParsedInputs: [classSlug] }) => {
        const { user } = ctx;

        await createTransaction(async (tx) => {
            const existingClass = await classesData.isOwner(user.id, classSlug);

            if (!existingClass) {
                throw new ActionError('You are not the owner of this class');
            }

            const insertedLearningMaterial = await materialsData.create(
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
                parsedInput.files.forEach(async (file) => {
                    await filesData
                        .patch(
                            file.id,
                            {
                                learningMaterialId:
                                    insertedLearningMaterial[0].id,
                            },
                            { tx },
                        )
                        .catch(() => {
                            throw new ActionError(
                                'Failed to attach files to learning material',
                            );
                        });
                });
            }

            const recipientsNotification = await classMembersData.findIdMembers(
                existingClass.id,
            );

            await notificationsData.createMany(
                recipientsNotification.map((r) => ({
                    userId: r,
                    title: 'New Learning Material added',
                    isRead: false,
                    message: `New learning material "${parsedInput.title}" has been added to the class "${existingClass.className}"`,
                    url: `/classes/${classSlug}`,
                })),
                { tx },
            );

            const goreal = new Goreal(user.id);

            const is_success = await goreal.pushBroadcast({
                event: Goreal.broadcastKey.NOTIFICATION_UPDATED,
                recipients: recipientsNotification,
            });

            if (!is_success) {
                tx.rollback();
                throw new ActionError('Failed to broadcast notification');
            }

            revalidatePath(`/class/${classSlug}`);
        });
        return {
            success: true,
            message: 'Learning material created successfully',
        };
    });

export const getDetailsLearningMaterial = async (materialId: string) => {
    return await materialsData.findOne(materialId);
};
