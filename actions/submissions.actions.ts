'use server';
import {
    findAssignment,
    findDetailsAssignment,
    findDetailsAssignmentForStudent,
} from '@/common/data-access/assignments';
import { patchFiles } from '@/common/data-access/files';
import {
    findSubmissionById,
    insertSubmission,
    patchSubmission,
} from '@/common/data-access/submissions';
import {
    ActionError,
    studentProcedure,
    teacherProcedure,
} from '@/common/libs/safe-action';
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

            const assignment = await findAssignment(assignmentId);

            if (!assignment) {
                throw new ActionError('Assignment not found');
            }

            if (!assignment.isOpen) {
                throw new ActionError('Assignment is closed');
            }

            const insertedSubmission = await insertSubmission({
                studentId: user.id,
                assignmentId: assignment.id,
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

export const submitGrades = teacherProcedure
    .metadata({
        actionName: 'submitsGrade',
    })
    .schema(SubmissionsModel.submitGradesSchema)
    .action(async ({ ctx, parsedInput }) => {
        const { user: teacher } = ctx;

        parsedInput.forEach(async (grade) => {
            const submission = await findSubmissionById(grade.id);
            if (!submission) {
                throw new ActionError('Submission not found');
            }

            if (submission.assignment.authorId !== teacher.id) {
                throw new ActionError('Unauthorized to submit grade');
            }

            await patchSubmission({
                id: grade.id,
                grade: String(grade.grade),
                isGraded: true,
            }).catch(() => {
                throw new ActionError('Failed to submit grade');
            });
        });

        return {
            message: 'Grades submitted successfully',
        };
    });
