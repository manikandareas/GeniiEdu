import { OurFileRouter } from '@/app/_libs/uploadthing';
import {
    generateUploadButton,
    generateUploadDropzone,
} from '@uploadthing/react';

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
