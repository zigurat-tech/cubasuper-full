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
    }
};

const withPWAConfig = withPWA({
    dest: './public',
    register: true,
    disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWAConfig(withSvgr(nextConfig));
