import { Facebook, GitHub, Google } from 'arctic';
import { Env } from '../Env';

export const google = new Google(
    Env.GOOGLE_CLIENT_ID,
    Env.GOOGLE_CLIENT_SECRET,
    Env.NEXT_PUBLIC_APP_URL + '/api/oauth/google',
);

export const github = new GitHub(
    Env.GITHUB_CLIENT_ID,
    Env.GITHUB_CLIENT_SECRET,
    {
        redirectURI: Env.NEXT_PUBLIC_APP_URL + '/api/oauth/github',
    },
);

// export const facebook = new Facebook(
//     process.env.FACEBOOK_CLIENT_ID!,
//     process.env.FACEBOOK_CLIENT_SECRET!,
//     process.env.NEXT_PUBLIC_BASE_URL + '/api/oauth/facebook',
// );
