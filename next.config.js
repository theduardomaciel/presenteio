/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        })

        return config
    },
    async redirects() {
        return [
            {
                source: '/login',
                destination: '/auth/login',
                permanent: true,
            },
            {
                source: '/register',
                destination: '/auth/register',
                permanent: true,
            },
        ]
    },
    /* images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/my-bucket/**',
            },
        ],
    }, */
    images: {
        domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'github.com'],
    },
}

module.exports = nextConfig
