import { eq, inArray } from 'drizzle-orm';
import db from '../_libs/db/DB';
import { files } from '../_libs/db/schema';
import { DataAccessConfig } from './types';
import { FilesType } from '../_libs/db/schema';

class FilesData {
    async findOneByKey(key: string, config: DataAccessConfig<'files'> = {}) {
        return await (config.tx ? config.tx : db).query.files.findFirst({
            where: (files, { eq }) => eq(files.key, key),
        });
    }

    async create(input: FilesType, config: DataAccessConfig<'files'> = {}) {
        return await (config.tx ? config.tx : db)
            .insert(files)
            .values(input)
            .returning();
    }

    async createMany(
        input: FilesType[],
        config: DataAccessConfig<'files'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .insert(files)
            .values(input)
            .returning();
    }

    async deleteByKey(key: string[], config: DataAccessConfig<'files'> = {}) {
        return await (config.tx ? config.tx : db)
            .delete(files)
            .where(inArray(files.key, key));
    }

    async patch(
        fileId: string,
        data: Partial<FilesType>,
        config: DataAccessConfig<'files'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .update(files)
            .set(data)
            .where(eq(files.id, fileId))
            .returning();
    }

    async deleteFilesByKey(
        key: string[],
        config: DataAccessConfig<'files'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .delete(files)
            .where(inArray(files.key, key));
    }
}

const filesData = new FilesData();
export default filesData;
