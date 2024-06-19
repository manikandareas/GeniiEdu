import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// Don't add NODE_ENV into T3 Env, it changes the tree-shaking behavior
export const Env = createEnv({
    server: {
        // DATABASE_URL: z.string().min(1),
        DATABASE_AUTH_TOKEN: z.string().optional(),
        LOGTAIL_SOURCE_TOKEN: z.string().optional(),
        DATABASE_HOST: z.string().min(1),
        DATABASE_PORT: z.number().min(1),
        DATABASE_NAME: z.string().min(1),
        DATABASE_USER: z.string().min(1),
        DATABASE_PASSWORD: z.string().optional(),
        JWT_SECRET: z.string().min(1),
        RESEND_API_KEY: z.string().min(1),
        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),
        UPLOADTHING_APP_ID: z.string().min(1),
        UPLOADTHING_SECRET: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_APP_URL: z.string().optional(),
    },
    // You need to destructure all the keys manually
    runtimeEnv: {
        // DATABASE_URL: process.env.DATABASE_URL,
        DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
        LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_PORT: Number(process.env.DATABASE_PORT),
        DATABASE_NAME: process.env.DATABASE_NAME,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
        DATABASE_USER: process.env.DATABASE_USER,
        JWT_SECRET: process.env.JWT_SECRET,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
        UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    },
});
