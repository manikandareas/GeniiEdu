import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { validateRequest } from './lucia';

const f = createUploadthing();

// Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    classThumbnailUploader: f({
        image: { maxFileSize: '4MB', maxFileCount: 1 },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const { user } = await validateRequest();

            // If you throw, the user will not be able to upload
            if (!user) throw new UploadThingError('Unauthorized');

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log('Upload complete for userId:', metadata.userId);

            console.log('file url', file.url);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId, url: file.url };
        }),
    learningMaterialsFileUploader: f([
        'pdf',
        'application/vnd.ms-word.document.macroenabled.12',
        'application/vnd.ms-powerpoint',
        'image',
    ])
        .middleware(async ({ req }) => {
            const { user } = await validateRequest();
            if (!user) throw new UploadThingError('Unauthorized');
            return { userId: user.id };
        })
        .onUploadError(async ({ error, fileKey }) => {
            console.log({
                message: 'Error uploading file',
                error,
                file: fileKey,
            });
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log('Upload complete for userId:', metadata.userId);

            console.log('file url', file.url);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId, url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

import { UTApi } from 'uploadthing/server';

export const utapi = new UTApi();
