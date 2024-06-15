'use server';

import { Env } from '@/common/libs/Env';
import React from 'react';
import { Resend } from 'resend';

// Creates an instance of Resend using the API KEY
const resend = new Resend(Env.RESEND_API_KEY);

// Defines the data structure for an email.
type Email = {
    to: string[]; // An array of email addresses to which to send the email.
    subject: string; // The subject of the email.
    react: React.ReactElement; // The body of the email as a React element.
};

export const sendEmail = async (payload: Email) => {
    const { error } = await resend.emails.send({
        from: 'GeniiEdu <no-reply@geniiedu.site>', // Defines the sender's address.
        ...payload, // Expands the contents of 'payload' to include 'to', 'subject', and 'react'.
    });

    if (error) {
        console.error('Error sending email', error);
        return null;
    }

    console.log('Email sent successfully');
    return true;
};
