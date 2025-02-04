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

export const prettyText = (text: string, limit: number = 85) => {
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
};

// Fungsi untuk mengubah UUID ke Buffer
function uuidToBuffer(uuid: string): Buffer {
    return Buffer.from(uuid.replace(/-/g, ''), 'hex');
}

// Fungsi untuk mengubah Buffer ke UUID
function bufferToUuid(buffer: Buffer): string {
    const hex = buffer.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Fungsi untuk mengenkripsi UUID
export function encodeUuid(uuid: string): string {
    const buffer = uuidToBuffer(uuid);
    return buffer.toString('base64url'); // Menggunakan base64url agar aman untuk URL
}

// Fungsi untuk mendekripsi UUID
export function decodeUuid(encodedUuid: string): string {
    const buffer = Buffer.from(encodedUuid, 'base64url');
    return bufferToUuid(buffer);
}

import { format, formatDistanceToNow, isBefore, subDays } from 'date-fns';
import { id } from 'date-fns/locale'; // Import locale Bahasa Indonesia

export const formatDate = (date: Date, addSuffix: boolean = true): string => {
    const now = new Date();
    const sevenDaysAgo = subDays(now, 7);

    if (isBefore(date, sevenDaysAgo)) {
        return format(date, 'd MMMM', { locale: id }); // Format: '7 Juli'
        // return format(date, 'd MMMM'); // Format: '7 Juli'
    } else {
        return formatDistanceToNow(date, { addSuffix: addSuffix, locale: id }); // Format: '2 hari yang lalu'
        // return formatDistanceToNow(date, { addSuffix: true }); // Format: '2 hari yang lalu'
    }
};

export function toPusherKey(key: string) {
    return key.replace(/:/g, '__');
}

export const getMatches = (text: string, searchTerm: string, limit = 1) => {
    // create dynamic regex 😎
    const regex = new RegExp(searchTerm, 'gi');
    // word indexes
    const indexes = [];
    // matches count
    let matches = 0;
    // current match in loop
    let match;

    while ((match = regex.exec(text)) !== null && matches < limit) {
        // push that shit
        indexes.push(match.index);
        // increment matches
        matches++;
    }

    return indexes.map((index) => {
        // go back 20 characters
        const start = index - 20;
        // go forward 80 characters
        const end = index + 80;
        // yoink the text
        const excerpt = text.substring(start, end).trim();
        // return excerpt 🤝
        return `...${replaceTextWithMarker(excerpt, searchTerm)}...`;
    });
};

export const replaceTextWithMarker = (text: string, match: string) => {
    // create dynamic regex 😎
    const regex = new RegExp(match, 'gi');
    // preserves the text casing 🤙
    return text.replaceAll(regex, (match) => `<mark>${match}</mark>`);
};
