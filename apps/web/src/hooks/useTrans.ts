import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { LanguageKeys } from '@type/languageKeys';

type TransReturn = {
    t: (key: LanguageKeys) => string;
    locale: 'en' | 'es';
    switchLocale: () => Promise<void>;
    switchLocaleEn: () => Promise<void>;
    switchLocaleEs: () => Promise<void>;
};

export const useTrans = (): TransReturn => {
    const router = useRouter();
    const { t } = useTranslation();

    async function switchLocale() {
        await router.push(router.asPath, router.asPath, {
            locale: router.locale === 'en' ? 'es' : 'en'
        });
    }

    async function switchLocaleEn() {
        await router.push(router.asPath, router.asPath, {
            locale: 'en'
        });
    }

    async function switchLocaleEs() {
        await router.push(router.asPath, router.asPath, {
            locale: 'es'
        });
    }

    function translate(key: LanguageKeys) {
        return t(key);
    }

    return {
        t: translate,
        locale: router.locale === 'en' ? 'en' : 'es',
        switchLocale,
        switchLocaleEn,
        switchLocaleEs
    };
};
