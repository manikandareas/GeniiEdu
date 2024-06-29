'use server';

import { deleteFilesByKey, insertFiles } from '@/common/data-access/files';
import { utapi } from '@/common/libs/Uploadthing';
import { authenticatedProcedure } from '@/common/libs/safe-action';
import { FilesTypeEnum } from '@/common/models/schema.model';
import { ActRes } from '@/common/types/Action.type';
import { z } from 'zod';

export const removeFiles = async (key: string[]) => {
    try {
        // ? Delete file from uploadthing and database
        const [utapiRes, sqlRes] = await Promise.all([
            utapi.deleteFiles(key),
            await deleteFilesByKey(key),
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
export const saveFilesToDB = authenticatedProcedure
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

            // @ts-ignore
            const mappedFiles = parsedInput.map((file) => ({
                userId: user.id,
                key: file.key!,
                type: file.type!,
                url: file.url!,
            }));

            const res = await insertFiles(mappedFiles);

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
