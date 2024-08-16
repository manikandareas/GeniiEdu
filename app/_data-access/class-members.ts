import { DataAccessConfig } from './types';
import db from '../_libs/db/DB';
import { classMembers } from '../_libs/db/schema';
import { eq } from 'drizzle-orm';

export type InsertClassMemberInput = typeof classMembers._.inferInsert;

class ClassMembersData {
    async create(
        input: InsertClassMemberInput,
        config: DataAccessConfig<'classMembers'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .insert(classMembers)
            .values(input)
            .returning();
    }

    async findMany(
        userId: string,
        config: DataAccessConfig<'classMembers'> = {},
    ) {
        return await (config.tx ? config.tx : db).query.classMembers.findMany({
            where: (classMembers, { eq }) => eq(classMembers.userId, userId),
            with: {
                class: {
                    with: {
                        thumbnail: true,
                    },
                },
            },
            orderBy(fields, operators) {
                return operators.asc(fields.joinedAt);
            },
        });
    }

    async findManyWhereStudentId(studentId: string) {
        return await db.query.classMembers.findMany({
            where: (classMembers, { eq }) => eq(classMembers.userId, studentId),
            with: {
                class: {
                    with: {
                        teacher: true,
                        thumbnail: true,
                    },
                },
            },
            orderBy(fields, operators) {
                return operators.asc(fields.joinedAt);
            },
        });
    }

    async findForSearch(userId: string) {
        const query = await db.query.classMembers.findMany({
            where: (cm, { eq }) => eq(cm.userId, userId),
            with: {
                class: {
                    columns: {
                        className: true,
                        description: true,
                        slug: true,
                    },
                },
            },
            columns: {
                id: true,
            },
        });

        return query.map((data) => ({
            title: data.class.className,
            content: data.class.description,
            url: `/classes/${data.class.slug}`,
        }));
    }

    async delete(id: number, config: DataAccessConfig<'classMembers'> = {}) {
        return await (config.tx ? config.tx : db)
            .delete(classMembers)
            .where(eq(classMembers.id, id))
            .returning();
    }

    async findIdMembers(
        classId: string,
        config: DataAccessConfig<'classMembers'> = {},
    ) {
        const res = await (
            config.tx ? config.tx : db
        ).query.classMembers.findMany({
            columns: {
                userId: true,
            },
            where: (classMembers, { and, eq }) =>
                and(
                    eq(classMembers.classId, classId),
                    eq(classMembers.role, 'student'),
                ),
        });

        return res.map((member) => member.userId) as string[];
    }

    async findOneWhereUserIdAndClassId(
        userId: string,
        classId: string,
        config: DataAccessConfig<'classMembers'> = {},
    ) {
        return await (config.tx ? config.tx : db).query.classMembers.findFirst({
            where: (classMembers, { and, eq }) =>
                and(
                    eq(classMembers.userId, userId),
                    eq(classMembers.classId, classId),
                ),
        });
    }
}

const classMembersData = new ClassMembersData();
export default classMembersData;
