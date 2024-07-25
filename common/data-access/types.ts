import { PgTransaction } from 'drizzle-orm/pg-core';
import { TypeDB } from '../libs/DB';
import { Schema } from '../models';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import { DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm';
import db from '../libs/DB';

export type InsertClassesInput = typeof Schema.classes._.inferInsert;

export type InsertEmailVerificationInput =
    typeof Schema.emailVerifications._.inferInsert;

export type SelectEmailVerification =
    typeof Schema.emailVerifications._.inferSelect;

export type PatchEmailVerificationInput = Partial<SelectEmailVerification>;

export type InsertUserInput = typeof Schema.users._.inferInsert;

export type SelectUser = typeof Schema.users._.inferSelect;

export type PatchUserInput = Partial<SelectUser>;

export type DataAccessConfig<TableName extends keyof TablesWithRelations> = {
    tx?: DBTransaction;
    queryConfig?: QueryConfig<TableName>;
};

export type DBTransaction = PgTransaction<
    PostgresJsQueryResultHKT,
    typeof Schema,
    ExtractTablesWithRelations<typeof Schema>
>;

export type InsertLearningMaterialInput =
    typeof Schema.learningMaterials._.inferInsert;

export type InsertAssignmentInput = typeof Schema.assignments._.inferInsert;

export type InsertClassMemberInput = typeof Schema.classMembers._.inferInsert;

export type InsertSubmissionInput = typeof Schema.submissions._.inferInsert;

export type PatchSubmissionInput = Partial<InsertSubmissionInput>;

export type PatchAssignmentInput = Partial<InsertAssignmentInput>;

type TablesWithRelations = ExtractTablesWithRelations<typeof Schema>;

export type QueryRelationsConfig<TableName extends keyof TablesWithRelations> =
    NonNullable<
        Parameters<
            (typeof db)['query'][TableName]['findFirst' | 'findMany']
        >['0']
    >;

// Testing it out
export type QueryConfig<TableName extends keyof TablesWithRelations> =
    QueryRelationsConfig<TableName>;
