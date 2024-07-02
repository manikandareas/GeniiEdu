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

export type InsertLearningMaterialFilesInput =
    typeof Schema.learningMaterialFiles._.inferInsert;

export type InsertMaterialModuleInput =
    typeof Schema.materialModules._.inferInsert;

export type InsertModuleInput = typeof Schema.modules._.inferInsert;

export type SelectModule = typeof Schema.modules._.inferSelect;

export type PatchModuleInput = Partial<SelectModule>;

export type InsertModuleIntoClassInput = Omit<
    typeof Schema.classModules._.inferInsert,
    'position'
>;
