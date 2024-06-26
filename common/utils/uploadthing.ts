import { generateReactHelpers } from '@uploadthing/react';
import { OurFileRouter } from '../libs/Uploadthing';

export const { useUploadThing, uploadFiles } =
    generateReactHelpers<OurFileRouter>();
