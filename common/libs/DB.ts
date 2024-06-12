import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "@/common/models/Schema";
import { Env } from "./Env";

const client = new Client({
  host: Env.DATABASE_HOST,
  port: Env.DATABASE_PORT,
  user: Env.DATABASE_USER,
  database: Env.DATABASE_NAME,
});
await client.connect();
export const db = drizzle(client, { schema, logger: true });
