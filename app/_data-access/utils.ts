import db from '../_libs/db/DB';
import { DBTransaction } from './types';
import { headers } from 'next/headers';

class UtilsData {
    async createTransaction<T extends DBTransaction>(cb: (trx: T) => void) {
        await db.transaction(cb as any);
    }

    getIp() {
        const forwardedFor = headers().get('x-forwarded-for');
        const realIp = headers().get('x-real-ip');

        if (forwardedFor) {
            return forwardedFor.split(',')[0].trim();
        }

        if (realIp) {
            return realIp.trim();
        }

        return null;
    }
}

const utilsData = new UtilsData();
export default utilsData;

export async function createTransaction<T extends DBTransaction>(
    cb: (trx: T) => void,
) {
    await db.transaction(cb as any);
}

export function getIp() {
    const forwardedFor = headers().get('x-forwarded-for');
    const realIp = headers().get('x-real-ip');

    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    if (realIp) {
        return realIp.trim();
    }

    return null;
}
