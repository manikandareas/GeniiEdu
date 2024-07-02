import db from '../libs/DB';
import { DBTransaction } from './types';

export async function createTransaction<T extends DBTransaction>(
    cb: (trx: T) => void,
) {
    await db.transaction(cb as any);
}
