/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
    i18n: {
        defaultLocale: 'es',
        locales: ['en', 'es']
    },
    // debug: process.env.NODE_ENV === 'development',
    reloadOnPrerender: process.env.NODE_ENV === 'development',
    localePath:
        typeof window === 'undefined'
            ? require('path').resolve('./public/locales')
            : '/locales'
};
