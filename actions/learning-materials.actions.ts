'use server';

import {
    findIDMembersOfClass,
    isOwnerOfClass,
} from '@/common/data-access/classes';
import { patchFiles } from '@/common/data-access/files';
import {
    findDetailsLearningMaterial,
    insertLearningMaterial,
} from '@/common/data-access/learning-materials';
import { insertNotifications } from '@/common/data-access/notifications';

import { createTransaction } from '@/common/data-access/utils';
import { Goreal } from '@/common/libs/goreal';
import { ActionError, teacherProcedure } from '@/common/libs/safe-action';
import { insertLearningMaterialsSchema } from '@/common/models/learning-materials.model';
import { ActRes } from '@/common/types/Action.type';
import { revalidatePath } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import * as z from 'zod';

export const createLearningMaterial = teacherProcedure
    .metadata({
        actionName: 'createLearningMaterial',
    })
    .bindArgsSchemas<[classSlug: z.ZodString]>([z.string()])
    .schema(insertLearningMaterialsSchema)
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
                parsedInput.files.forEach(async (file) => {
                    await patchFiles(
                        file.id,
                        { learningMaterialId: insertedLearningMaterial[0].id },
                        { tx },
                    ).catch(() => {
                        throw new ActionError(
                            'Failed to attach files to learning material',
                        );
                    });
                });
            }

            const recipientsNotification = await findIDMembersOfClass(
                existingClass.id,
            );

            await insertNotifications(
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
        } satisfies ActRes;
    });

export const getDetailsLearningMaterial = async (materialId: string) => {
    return await findDetailsLearningMaterial(materialId);
};
