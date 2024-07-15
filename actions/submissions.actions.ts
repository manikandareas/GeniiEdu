'use server';
import { patchFiles } from '@/common/data-access/files';
import { insertSubmission } from '@/common/data-access/submissions';
import { ActionError, studentProcedure } from '@/common/libs/safe-action';
import { SubmissionsModel } from '@/common/models';
import { z, ZodObject, ZodString } from 'zod';

export const createSubmission = studentProcedure
    .metadata({
        actionName: 'insertSubmission',
    })
    .bindArgsSchemas<[ZodString]>([z.string()])
    .schema(SubmissionsModel.createSubmissionSchema)
    .action(
        async ({ ctx, parsedInput, bindArgsParsedInputs: [assignmentId] }) => {
            const { user } = ctx;

            const insertedSubmission = await insertSubmission({
                studentId: user.id,
                assignmentId: assignmentId,
            });

            if (!insertedSubmission) {
                throw new ActionError('Failed to create submission');
            }

            if (parsedInput.files && parsedInput.files.length > 0) {
                parsedInput.files.forEach(async (file) => {
                    await patchFiles(file.id, {
                        submissionId: insertedSubmission.id,
                    }).catch(() => {
                        throw new ActionError(
                            'Failed to attach files to submission',
                        );
                    });
                });
            }

            return {
                message: 'Submission created successfully',
            };
        },
    );
