import { dummyThumbnail, updatedDummyClasses } from "@/common/constants/DummyClasses";
import * as Schema from "@/common/models/schema.model";
import { db } from "./index";

/**
 * Seeds the database with 10 student accounts.
 *
 * @return {Promise<void>} Promise that resolves when the seeding is complete.
 */
export const classesSeeder = async () => {

    console.log('Running class seed script...');
    
    
    await db.insert(Schema.files).values(dummyThumbnail)


    await db.insert(Schema.classes).values(updatedDummyClasses)
    
}

// export const joinClassSeeder = async () => {
//     console.log('Running join class seed script...');

//     const data = dummyClasses.map((cls) => ({
//         userId: '01903a38-2c01-7e32-ac29-1b5ec60ffca5',
//         classId: 
//     }))

//     await db.insert(Schema.classMembers).values({

//     })


// }


// const classId = [
//     'class_IDvMGRqiheUDjLD',
//     'class_42wq9UBJVhwHPqy',
//     'class_Bl0rw8cxCQn_Kz9',

// ]