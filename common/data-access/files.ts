import { eq, inArray } from 'drizzle-orm';
import db from '../libs/DB';
import { Schema } from '../models';
import { FilesType } from '../models/schema.model';
import { DataAccessConfig } from './types';

export const findFileByKey = async (key: string) => {
    return await db.query.files.findFirst({
        where: (files, { eq }) => eq(files.key, key),
    });
};

export const insertFile = async (files: FilesType) => {
    return await db.insert(Schema.files).values(files).returning();
};

export const insertFiles = async (files: FilesType[]) => {
    return await db.insert(Schema.files).values(files).returning();
};

export const deleteFilesByKey = async (key: string[]) => {
    return await db.delete(Schema.files).where(inArray(Schema.files.key, key));
};

export const patchFiles = async (
    fileId: string,
    data: Partial<FilesType>,
    config: DataAccessConfig = {},
) => {
    return await (config.tx ? config.tx : db)
        .update(Schema.files)
        .set(data)
        .where(eq(Schema.files.id, fileId))
        .returning();
};

// db.delete(Schema.files).where(inArray(Schema.files.key, key)),
