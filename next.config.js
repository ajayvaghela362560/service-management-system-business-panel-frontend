/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'api.slingacademy.com',
                port: ''
            }
        ]
    },
    transpilePackages: ['geist'],
    env: {
        SERVER_URL: 'http://217.79.189.199:4000/',
        WS_SERVER_URL: 'ws://217.79.189.199:4000/',
        GOOGLE_CLIENT_ID: "385774756985-r2mpap39qv4pvperdia573psbatt2u1d.apps.googleusercontent.com"
    }
};

module.exports = nextConfig;  