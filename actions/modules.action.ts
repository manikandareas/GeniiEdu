'use server';

import {
    findDetailModuleBySlug,
    findModuleBySlug,
    findTeacherModules,
    insertModule,
} from '@/common/data-access/module';
import { validateRequest } from '@/common/libs/lucia';
import { teacherActionClient } from '@/common/libs/safe-action';
import { ModulesModel } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
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
            const registeredModuleBySlug = await findModuleBySlug(
                parsedInput.slug,
            );

            if (registeredModuleBySlug) {
                throw new Error(
                    'Module slug already exists, please modify it.',
                );
            }

            const insertedModule = await insertModule({
                moduleName: parsedInput.moduleName,
                slug: parsedInput.slug,
                description: parsedInput.description,
                authorId: ctx.user.id,
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
        const { user: teacher } = await validateRequest();

        if (!teacher) {
            throw new Error('Unauthorized');
        }

        const teacherModules = await findTeacherModules(teacher.id);

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

export const getDetailModuleBySlug = async (slug: string) => {
    try {
        const existingModule = await findDetailModuleBySlug(slug);

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
    ReturnType<typeof getDetailModuleBySlug>
>['data'];
