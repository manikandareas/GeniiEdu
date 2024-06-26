import * as schema from '@/common/models/schema.model';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { studentAccountSeeder, teacherAccountSeeder } from './users';
import { classesSeeder } from './classes';


const pg = postgres({
    host: 'localhost',
    port: 5432,
    user: 'manik',
    database: 'genii_edu',
})

export const db = drizzle(pg, { schema }) as PostgresJsDatabase<typeof schema>;


async function main() {
    console.log('Running seed script...');

    // const [student, teacher] = await Promise.all([studentAccountSeeder(1), teacherAccountSeeder(1)])



    await classesSeeder()
    


    
}


main().then(_ =>{
    console.log('Seed script completed')
    process.exit(0)
}).catch(err => {
    console.error(err)
    process.exit(0)
})