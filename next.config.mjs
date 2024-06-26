/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'avatars.githubusercontent.com',
                protocol: 'https',
            },
            {
                hostname: 'lh3.googleusercontent.com',
                protocol: 'https',
            },
            {
                hostname: 'images.unsplash.com',
                protocol: 'https',
            },
            {
                hostname: 'img.icons8.com',
                protocol: 'https',
            },
            {
                hostname: 'picsum.photos',
                protocol: 'https',
            },
            {
                hostname: 'utfs.io',
                protocol: 'https',
            },
            {
                hostname: 'cloudflare-ipfs.com',
                protocol: 'https',
            },
        ],
    },
};

export default nextConfig;
