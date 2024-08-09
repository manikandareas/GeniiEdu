import { base, en, Faker, id_ID } from '@faker-js/faker';

export const fakerId = new Faker({
    locale: [id_ID, en, base],
});
