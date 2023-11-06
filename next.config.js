/** @type {import('next').NextConfig} */

const withSvgr = require("next-plugin-svgr");

module.exports = withSvgr({
    webpack(config, options) {
        return config;
    },
    async redirects() {
        return [
            {
                source: "/login",
                destination: "/auth/login",
                permanent: true,
            },
            {
                source: "/register",
                destination: "/auth/register",
                permanent: true,
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/",
            },
            {
                protocol: "https",
                hostname: "i.imgur.com",
                port: "",
                pathname: "/",
            },
            {
                protocol: "https",
                hostname: "github.com",
                port: "",
                pathname: "/",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "",
                pathname: "/",
            },
        ],
    },
});
