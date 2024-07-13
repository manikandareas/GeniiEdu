import { PgTransaction } from 'drizzle-orm/pg-core';
import { TypeDB } from '../libs/DB';
import { Schema } from '../models';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import { ExtractTablesWithRelations } from 'drizzle-orm';

export type InsertClassesInput = typeof Schema.classes._.inferInsert;

export type InsertEmailVerificationInput =
    typeof Schema.emailVerifications._.inferInsert;

export type SelectEmailVerification =
    typeof Schema.emailVerifications._.inferSelect;

export type PatchEmailVerificationInput = Partial<SelectEmailVerification>;

export type InsertUserInput = typeof Schema.users._.inferInsert;

export type SelectUser = typeof Schema.users._.inferSelect;

export type PatchUserInput = Partial<SelectUser>;

export type DataAccessConfig = {
    tx?: DBTransaction;
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
