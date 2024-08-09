'use server';

import { Env } from '../_libs/env';
import { Resend } from 'resend';
import { z } from 'zod';
import { actionProcedure } from '../_libs/safe-action';
const resend = new Resend(Env.RESEND_API_KEY);

/// * Actions running expectedly
const sendEmailSchema = z.object({
    to: z.string().email().array(),
    subject: z.string(),
    react: z.any(),
});
export const sendEmail = actionProcedure
    .metadata({
        actionName: 'sendEmail',
    })
    .schema(sendEmailSchema)
    .action(async ({ parsedInput }) => {
        const { to, subject, react } = parsedInput;
        const { error } = await resend.emails.send({
            from: 'GeniiEdu <no-reply@geniiedu.site>',
            to,
            subject,
            react,
        });

        if (error) {
            console.error('Error sending email', error);
            return null;
        }

        console.log('Email sent successfully');
        return true;
    });
