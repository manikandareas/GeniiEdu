'use server';

import {
    findClassesUsedModule,
    findDetailModuleBySlug,
    findModuleBySlug,
    findTeacherModules,
    insertModule,
    patchModule,
} from '@/common/data-access/module';
import { validateRequest } from '@/common/libs/lucia';
import { teacherProcedure } from '@/common/libs/safe-action';
import { ModulesModel } from '@/common/models';
import { ActRes } from '@/common/types/Action.type';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const createModule = teacherProcedure
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

        const classes = await findClassesUsedModule(existingModule.id);

        const existingModuleWithClasses = {
            ...existingModule,
            classes,
        };

        return {
            success: true,
            data: existingModuleWithClasses,
        } satisfies ActRes<typeof existingModuleWithClasses>;
    } catch (error: any) {
        return {
            error: error.message,
            success: false,
        } satisfies ActRes;
    }
};

export type GetDetailModuleBySlug = Awaited<
    ReturnType<typeof getDetailModuleBySlug>
>;

export const togglePublishedModule = teacherProcedure
    .metadata({
        actionName: 'togglePublishedModule',
    })
    .schema(z.string())
    .action(async ({ parsedInput: slug, ctx }) => {
        try {
            const ownModule = await findModuleBySlug(slug);

            if (!ownModule) {
                throw new Error('Module not found');
            }

            if (ownModule.authorId !== ctx.user.id) {
                throw new Error('Unauthorized');
            }

            const updatedModule = await patchModule(
                {
                    isPublished: !ownModule.isPublished,
                },
                ownModule.id,
            );

            if (updatedModule.length === 0) {
                throw new Error('Something went wrong, please try again.');
            }

            revalidatePath(`/modules/${slug}`);
            return {
                success: true,
                message: `Module ${ownModule.moduleName} has been ${updatedModule[0].isPublished ? 'published' : 'unpublished'}`,
            } satisfies ActRes;
        } catch (error: any) {
            return {
                error: error.message,
                success: false,
            } satisfies ActRes;
        }
    });
