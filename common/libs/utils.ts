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

import Hashids from 'hashids';
import { Env } from './Env';

// Buat instans hashids
const hashids = new Hashids('secret_key', 6); // Ganti 'your_salt' dengan kunci rahasia yang aman

// Fungsi untuk mengenkripsi ID
export function encodeId(id: number): string {
    return hashids.encode(id);
}

// Fungsi untuk mendekripsi ID
export function decodeId(encodedId: string): number | null {
    const decoded = hashids.decode(encodedId);
    // @ts-ignore
    return decoded.length > 0 ? decoded[0] : null;
}

export const prettyText = (text: string, limit: number = 85) => {
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
};
