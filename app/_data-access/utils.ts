import db from '../_libs/db/DB';
import { DBTransaction } from './types';

export async function createTransaction<T extends DBTransaction>(
    cb: (trx: T) => void,
) {
    await db.transaction(cb as any);
}

import { headers } from 'next/headers';

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
