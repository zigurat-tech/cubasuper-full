import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

export const withLocale = async (
    ctx: GetStaticPropsContext | GetServerSidePropsContext
) => {
    return {
        props: {
            ...(await serverSideTranslations(ctx.locale ?? 'es'))
        }
    };
};
