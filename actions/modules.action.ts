'use server';

import { ModulesModel, Schema } from '@/common/models';
import db from '@/common/libs/DB';
import { teacherActionClient } from '.';
import { eq } from 'drizzle-orm';
import { ActRes } from '@/common/types/Action.type';
import { validateRequest } from '@/common/libs/lucia';
import { revalidatePath } from 'next/cache';

export const createModule = teacherActionClient
    .metadata({
        actionName: 'createModule',
    })
    .schema(ModulesModel.createModuleSchema)
    .action(async ({ parsedInput, ctx }) => {
        if (!parsedInput.slug) {
            parsedInput.slug = parsedInput.moduleName
                .replace(/\s+/g, '-')
                .replace('/', '-')
                .toLowerCase();
        }

        try {
            const registeredModuleBySlug = await db.query.modules.findFirst({
                where: eq(Schema.modules.slug, parsedInput.slug),
            });

            if (registeredModuleBySlug) {
                throw new Error(
                    'Module slug already exists, please modify it.',
                );
            }

            const insertedModule = await db
                .insert(Schema.modules)
                .values({
                    moduleName: parsedInput.moduleName,
                    slug: parsedInput.slug,
                    description: parsedInput.description,
                    authorId: ctx.user.id,
                })
                .returning({
                    slug: Schema.modules.slug,
                });

            if (insertedModule.length === 0) {
                throw new Error('Something went wrong, please try again.');
            }

            revalidatePath('/modules');

            return {
                success: true,
                message: `Module ${parsedInput.moduleName} created successfully`,
                data: {
                    slug: insertedModule[0].slug,
                },
            } satisfies ActRes;
        } catch (error: any) {
            return {
                error: error.message,
                success: false,
            } satisfies ActRes;
        }
    });

export const getTeacherModules = async () => {
    try {
        const { user } = await validateRequest();

        if (!user) {
            throw new Error('Unauthorized');
        }

        const teacherModules = await db.query.modules.findMany({
            where: eq(Schema.modules.authorId, user.id),
        });

        return {
            success: true,
            data: teacherModules,
        } satisfies ActRes<typeof teacherModules>;
    } catch (error: any) {
        return {
            error: error.message,
            success: false,
        } satisfies ActRes;
    }
};

export const getModuleBySlug = async (slug: string) => {
    try {
        const existingModule = await db.query.modules.findFirst({
            where: eq(Schema.modules.slug, slug),
            with: {
                materials: {
                    with: {
                        material: true,
                    },
                },
                assignments: true,
            },
        });

        if (!existingModule) {
            throw new Error('Module not found');
        }

        return {
            success: true,
            data: existingModule,
        } satisfies ActRes<typeof existingModule>;
    } catch (error: any) {
        return {
            error: error.message,
            success: false,
        } satisfies ActRes;
    }
};

export type GetModuleBySlug = Awaited<
    ReturnType<typeof getModuleBySlug>
>['data'];
