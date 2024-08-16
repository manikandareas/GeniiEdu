import db from '../_libs/db/DB';
import { classes } from '../_libs/db/schema';
import { DataAccessConfig } from './types';

export type InsertClassesInput = typeof classes._.inferInsert;

class ClassesData {
    async findOneBySlug(
        slug: string,
        config: DataAccessConfig<'classes'> = {},
    ) {
        return await db.query.classes.findFirst({
            ...config.queryConfig,
            where: (classes, { eq }) => eq(classes.slug, slug),
        });
    }

    async findOneByCode(
        code: string,
        config: DataAccessConfig<'classes'> = {},
    ) {
        return await db.query.classes.findFirst({
            ...config.queryConfig,
            where: (classes, { eq }) => eq(classes.classCode, code),
        });
    }

    async findOneById(id: string, config: DataAccessConfig<'classes'> = {}) {
        return await db.query.classes.findFirst({
            ...config.queryConfig,
            where: (classes, { eq }) => eq(classes.id, id),
        });
    }

    async create(
        input: InsertClassesInput,
        config: DataAccessConfig<'classes'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .insert(classes)
            .values(input)
            .returning()
            .then((res) => res[0]);
    }

    async isOwner(userId: string, classSlug: string) {
        return await db.query.classes.findFirst({
            where: (classes, { and, eq }) =>
                and(eq(classes.slug, classSlug), eq(classes.teacherId, userId)),
        });
    }

    detailsQuery = {
        learningMaterials: {
            with: {
                files: true,
            },
        },

        assignments: true,
        teacher: true,
        thumbnail: true,
        members: {
            with: {
                user: {
                    columns: {
                        name: true,
                        username: true,
                        profilePicture: true,
                        email: true,
                    },
                },
            },
        },
        announcements: true,
    } as const;
}

const classesData = new ClassesData();
export default classesData;
