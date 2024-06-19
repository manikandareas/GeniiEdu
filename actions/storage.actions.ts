'use server';

import db from '@/common/libs/DB';
import { utapi } from '@/common/libs/Uploadthing';
import { Schema } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
import { eq } from 'drizzle-orm';

export const removeFile = async (key: string) => {
    try {
        // ? Delete file from uploadthing and database
        const [utapiRes, sqlRes] = await Promise.all([
            utapi.deleteFiles(key),
            db.delete(Schema.images).where(eq(Schema.images.key, key)),
        ]);

        if (!utapiRes.success || sqlRes.rowCount === 0) {
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
