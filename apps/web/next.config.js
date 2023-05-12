const { i18n } = require('./next-i18next.config');
const withSvgr = require('@newhighsco/next-plugin-svgr');
const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    i18n,
    images: {
        unoptimized: true
    },
    publicRuntimeConfig: {
        NODE_ENV:process.env.NODE_ENV,
        NEXT_PUBLIC_URL:process.env.NEXT_PUBLIC_URL,
        NEXT_PUBLIC_BACKEND_URL:process.env.NEXT_PUBLIC_BACKEND_URL,
        NEXT_PUBLIC_BACKEND_API_KEY:process.env.NEXT_PUBLIC_BACKEND_API_KEY,
        NEXT_PUBLIC_REDSYS_MERCHANTCODE:process.env.NEXT_PUBLIC_REDSYS_MERCHANTCODE,
        NEXT_PUBLIC_REDSYS_SECRET:process.env.NEXT_PUBLIC_REDSYS_SECRET,
    },
};

const withPWAConfig = withPWA({
    dest: './public',
    register: true,
    disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWAConfig(withSvgr(nextConfig));
