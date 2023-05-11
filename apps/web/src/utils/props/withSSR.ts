import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

type WithSSRProps<T extends Object, C extends GetServerSidePropsContext> = {
    withParams?: boolean;
    withLocale?: boolean;
    gssp: (context: C) => Promise<GetServerSidePropsResult<T>>;
};

export const withSSR = <
    T extends Object,
    Q extends Record<string, string | string[]> | undefined = undefined,
    L extends string | undefined = undefined,
    C extends GetServerSidePropsContext = Q extends Record<
        string,
        string | string[]
    >
        ? Omit<GetServerSidePropsContext, 'params'> & {
              params: Q;
              locale: L;
          }
        : GetServerSidePropsContext
>({
    withParams,
    withLocale,
    gssp
}: WithSSRProps<T, C>) => {
    return async (ctx: C) => {
        if (withParams) {
            if (!ctx.params) {
                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                };
            }
        }
        if (withLocale) {
            if (!ctx.locale) {
                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                };
            }
        }

        return await gssp(ctx);
    };
};
