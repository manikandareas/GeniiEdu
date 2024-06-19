import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateRandomNumber(length: number): string {
    if (length <= 0) return '';

    let result = '';
    const digits = '0123456789';

    for (let i = 0; i < length; i++) {
        result += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return result;
}

export const generateRandomToken = (length: number): string => {
    const characters =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const charactersLength = characters.length;
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }
    return token;
};
