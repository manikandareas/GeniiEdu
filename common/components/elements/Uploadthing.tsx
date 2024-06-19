import { OurFileRouter } from '@/common/libs/Uploadthing';
import {
    generateUploadButton,
    generateUploadDropzone,
} from '@uploadthing/react';

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
