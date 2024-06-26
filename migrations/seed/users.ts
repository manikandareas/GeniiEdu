import * as Schema from "@/common/models/schema.model";
import { db } from "./index"
import { fakerId } from "@/common/libs/Faker";
import { uuidv7 } from "uuidv7";
import * as argon from 'argon2';

/**
 * Seeds the database with 10 student accounts.
 *
 * @return {Promise<void>} Promise that resolves when the seeding is complete.
 */
export const studentAccountSeeder = async (count: number = 10) => {
    console.log('Running student seed script...');


    const hashedPassword = await argon.hash('pasussmanju123');

    const seeder =  Array.from({ length: count }, () => {
        return {
            id: uuidv7(),
            email: 'student@mail.com',
            name: fakerId.person.fullName(),
            username: fakerId.internet.userName(),
            role: 'student' as 'teacher' | 'student',
            bio: fakerId.person.bio(),
            isEmailVerified: true,
            onBoardingComplete: true,
            profilePicture: fakerId.image.avatar(),
            passwordHash: hashedPassword as string,
        }
    });

    return await db.insert(Schema.users).values(seeder).returning({ id: Schema.users.id });
}


/**
 * Seeds the database with 10 teacher accounts.
 *
 * @return {Promise<void>} Promise that resolves when the seeding is complete.
 */
export const teacherAccountSeeder = async (count: number = 10) => {
    console.log('Running teacher seed script...');


    const hashedPassword = await argon.hash('pasussmanju123');

    const seeder =  Array.from({ length: count }, () => {
        return {
            id: uuidv7(),
            email: 'teacher@mail.com',
            name: fakerId.person.fullName(),
            username: fakerId.internet.userName(),
            role: 'teacher' as 'teacher' | 'student',
            bio: fakerId.person.bio(),
            isEmailVerified: true,
            onBoardingComplete: true,
            profilePicture: fakerId.image.avatar(),
            passwordHash: hashedPassword as string,
        }
    });

    return await db.insert(Schema.users).values(seeder).returning({ id: Schema.users.id });
}
