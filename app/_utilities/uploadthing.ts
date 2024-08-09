import { generateReactHelpers } from '@uploadthing/react';
import { OurFileRouter } from '../_libs/uploadthing';

export const { useUploadThing, uploadFiles } =
    generateReactHelpers<OurFileRouter>();
