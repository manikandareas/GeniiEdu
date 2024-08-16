import {
    BuildQueryResult,
    DBQueryConfig,
    ExtractTablesWithRelations,
} from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import db from '../_libs/db/DB';
import * as schema from '../_libs/db/schema';

export type DataAccessConfig<TableName extends keyof TablesWithRelations> = {
    tx?: DBTransaction;
    queryConfig?: QueryConfig<TableName>;
};

export type DBTransaction = PgTransaction<
    PostgresJsQueryResultHKT,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
>;

type TablesWithRelations = ExtractTablesWithRelations<typeof schema>;

export type QueryRelationsConfig<TableName extends keyof TablesWithRelations> =
    NonNullable<
        Parameters<
            (typeof db)['query'][TableName]['findFirst' | 'findMany']
        >['0']
    >;

export type QueryConfig<TableName extends keyof TablesWithRelations> =
    QueryRelationsConfig<TableName>;

type TSchema = ExtractTablesWithRelations<typeof schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
    'one' | 'many',
    boolean,
    TSchema,
    TSchema[TableName]
>['with'];

export type InferResultType<
    TableName extends keyof TSchema,
    With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
    TSchema,
    TSchema[TableName],
    {
        with: With;
    }
>;

export type InferReturnType<T extends (...args: any) => any> = Awaited<
    ReturnType<T>
>;
