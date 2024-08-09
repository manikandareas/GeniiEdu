'use server';

import { patchNotification } from '@/app/_data-access/notifications';
import { createTransaction } from '@/app/_data-access/utils';
import { authenticatedProcedure } from '@/app/_libs/safe-action';
import { z } from 'zod';

export const markAllNotificationAsRead = authenticatedProcedure
    .metadata({
        actionName: 'markNotificationAsRead',
    })
    .schema(z.array(z.number()))
    .action(async ({ parsedInput, ctx }) => {
        createTransaction((tx) => {
            parsedInput.forEach(async (id) => {
                const res = await patchNotification(
                    { id: id, isRead: true },
                    { tx },
                );
                if (!res) {
                    tx.rollback();
                    throw new Error('Failed to mark notification as read');
                }
            });
        });
        return {
            message: 'Notification marked as read',
        };
    });
