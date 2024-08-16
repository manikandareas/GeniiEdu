import db from '../_libs/db/DB';
import { learningMaterials } from '../_libs/db/schema';
import { DataAccessConfig } from './types';

export type InsertLearningMaterialInput =
    typeof learningMaterials._.inferInsert;

class Materials {
    async create(
        input: InsertLearningMaterialInput,
        config: DataAccessConfig<'learningMaterials'> = {},
    ) {
        return await (config.tx ? config.tx : db)
            .insert(learningMaterials)
            .values(input)
            .returning();
    }

    async findOne(
        id: string,
        config: DataAccessConfig<'learningMaterials'> = {},
    ) {
        return await (
            config.tx ? config.tx : db
        ).query.learningMaterials.findFirst({
            where: (learningMaterials, { eq }) => eq(learningMaterials.id, id),
            with: {
                files: true,
                author: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        profilePicture: true,
                    },
                },
                class: {
                    columns: {
                        className: true,
                        slug: true,
                    },
                },
            },
        });
    }
}

const materialsData = new Materials();
export default materialsData;
