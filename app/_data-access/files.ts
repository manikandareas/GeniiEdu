import { eq, inArray } from 'drizzle-orm';
import db from '../_libs/db/DB';
import { files } from '../_libs/db/schema';
import { DataAccessConfig } from './types';
import { FilesType } from '../_libs/db/schema';

export const findFileByKey = async (key: string) => {
    return await db.query.files.findFirst({
        where: (files, { eq }) => eq(files.key, key),
    });
};

export const insertFile = async (input: FilesType) => {
    return await db.insert(files).values(input).returning();
};

export const insertFiles = async (input: FilesType[]) => {
    return await db.insert(files).values(input).returning();
};

export const deleteFilesByKey = async (key: string[]) => {
    return await db.delete(files).where(inArray(files.key, key));
};

export const patchFiles = async (
    fileId: string,
    data: Partial<FilesType>,
    config: DataAccessConfig<'files'> = {},
) => {
    return await (config.tx ? config.tx : db)
        .update(files)
        .set(data)
        .where(eq(files.id, fileId))
        .returning();
};

// db.delete(files).where(inArray(files.key, key)),
