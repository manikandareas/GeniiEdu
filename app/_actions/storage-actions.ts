'use server';

import filesData from '@/app/_data-access/files';
import { utapi } from '@/app/_libs/uploadthing';
import { ActionError, authenticatedProcedure } from '@/app/_libs/safe-action';
import { FilesTypeEnum } from '../_libs/db/schema';
import { z } from 'zod';

export const removeFiles = async (key: string[]) => {
    try {
        // ? Delete file from uploadthing and database
        const [utapiRes, sqlRes] = await Promise.all([
            utapi.deleteFiles(key),
            await filesData.deleteFilesByKey(key),
        ]);

        if (!utapiRes.success || sqlRes.count === 0) {
            throw new Error('Something went wrong, please try again.');
        }

        return {
            success: true,
            message: 'File deleted successfully',
        };
    } catch (error: any) {
        return {
            error: error.message,
            success: false,
        };
    }
};

const saveFilesToDBSchema = z
    .array(
        z.object({
            url: z.string(),
            key: z.string(),
            name: z.string(),
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
        const { user } = ctx;

        if (!parsedInput) {
            throw new ActionError('No files to save');
        }

        // @ts-ignore
        const mappedFiles = parsedInput.map((file) => ({
            userId: user.id,
            key: file.key!,
            type: file.type!,
            url: file.url!,
            name: file.name!,
        }));

        const res = await filesData.createMany(mappedFiles);

        if (!res) {
            throw new ActionError('Failed to save files');
        }

        return {
            message: 'Files uploaded successfully',
            data: res,
        };
    });
