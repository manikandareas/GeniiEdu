'use server';

import db from '@/common/libs/DB';
import { utapi } from '@/common/libs/Uploadthing';
import { Schema } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
import { eq, inArray } from 'drizzle-orm';
import { authActionClient } from '.';
import { z } from 'zod';
import { FilesTypeEnum } from '@/common/models/schema.model';

export const removeFiles = async (key: string[]) => {
    try {
        // ? Delete file from uploadthing and database
        const [utapiRes, sqlRes] = await Promise.all([
            utapi.deleteFiles(key),
            db.delete(Schema.files).where(inArray(Schema.files.key, key)),
        ]);

        if (!utapiRes.success || sqlRes.count === 0) {
            throw new Error('Something went wrong, please try again.');
        }

        return {
            success: true,
            message: 'File deleted successfully',
        } satisfies ActRes;
    } catch (error: any) {
        return {
            error: error.message,
            success: false,
        } satisfies ActRes;
    }
};

const saveFilesToDBSchema = z
    .array(
        z.object({
            url: z.string(),
            key: z.string(),
            type: z.enum(FilesTypeEnum.enumValues),
        }),
    )
    .optional();
export const saveFilesToDB = authActionClient
    .metadata({
        actionName: 'saveFilesToDB',
    })
    .schema(saveFilesToDBSchema)
    .action(async ({ parsedInput, ctx }) => {
        if (!parsedInput) {
            throw new Error('Something went wrong, please try again.');
        }

        try {
            const { user } = ctx;

            const res = await db
                .insert(Schema.files)
                .values(
                    parsedInput.map((file) => ({
                        userId: user.id,
                        key: file.key!,
                        type: file.type!,
                        url: file.url!,
                    })),
                )
                .returning();

            return {
                success: true,
                message: 'Files uploaded successfully',
                data: res,
            } satisfies ActRes<typeof res>;
        } catch (error: any) {
            return {
                error: error.message,
                success: false,
            } satisfies ActRes;
        }
    });
