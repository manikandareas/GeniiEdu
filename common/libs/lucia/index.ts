import { Lucia } from 'lucia';
import adapter from './adapter';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { RoleEnum } from '@/common/models/Schema';

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === 'production',
        },
    },

    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            role: attributes.role,
            username: attributes.username,
            email: attributes.email,
            profilePicture: attributes.profilePicture,
            bio: attributes.bio,
            isEmailVerified: attributes.isEmailVerified,
            googleId: attributes.googleId,
            githubId: attributes.githubId,
        };
    },
});

export const validateRequest = cache(async () => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId)
        return {
            user: null,
            session: null,
        };

    const { user, session } = await lucia.validateSession(sessionId);
    try {
        if (session && session.fresh) {
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes,
            );
        }
        if (!session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes,
            );
        }
    } catch {
        // Next.js throws error when attempting to set cookies when rendering page
    }
    return {
        user,
        session,
    };
});

// IMPORTANT!
declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }

    interface DatabaseUserAttributes {
        id: string;
        role: (typeof RoleEnum.enumValues)[number];
        username?: string;
        email: string;
        profilePicture?: string;
        bio?: string;
        isEmailVerified: boolean;
        googleId?: string;
        githubId?: string;
    }
}
