import {api, apiClient, serverApiClient} from '@api/server';
import {
    Center,
    Divider,
    Heading,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';
import {
    CategoriesAccordion,
    ProductListDynamic
} from '@components/categories';
import { Copyright } from '@components/layout/copyright/Copyright';
import { useTrans } from '@hooks/useTrans';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { z } from 'zod';

type PageProps = {
    category: number;
    subcategory: number;
};

type PageParams = {
    category: string;
    subcategory: string;
};

export default function Page({
    category,
    subcategory
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { t, locale } = useTrans();
    const { data: products } = api.useQuery('/backend/v1/product/', {
        queries: {
            subcategory
        }
    });

    return (
        <Stack
            width={'full'}
            height={'full'}
            overflowY={'hidden'}
            spacing={'0px'}
            maxHeight={'calc(100vh - 72px)'}
            // paddingTop={{ base: "8rem", lg: "4.5rem" }}
            direction={{ base: 'column', lg: 'row' }}
        >
            <CategoriesAccordion
                category={category}
                subcategory={subcategory}
            />
            {products && products.results.length > 0 ? (
                <VStack
                    alignItems={'start'}
                    paddingTop={'3rem'}
                    paddingBottom={'1rem'}
                    paddingX={{ base: '1rem', lg: '4rem' }}
                    width={'full'}
                    spacing={'2rem'}
                    overflowY={'scroll'}
                >
                    <Heading
                        width={'full'}
                        fontSize={'2xl'}
                        fontWeight={700}
                        paddingLeft={'0.5rem'}
                    >
                        {products.results[0] && locale === 'es'
                            ? products.results[0].definition?.subcategory?.name
                            : products.results[0].definition?.subcategory
                                  ?.name_trans}
                    </Heading>
                    <Divider backgroundColor={'neutral.100'} />

                    <ProductListDynamic products={products} />
                    <Copyright />
                </VStack>
            ) : (
                <Center width={'full'}>
                    <Text>{t('products.empty')}</Text>
                </Center>
            )}
        </Stack>
    );
}

const ParamsParse = z.object({
    category: z.string().nullish().optional().transform(Number),
    subcategory: z.string().nullish().optional().transform(Number)
});

export const getServerSideProps: GetServerSideProps<
    PageProps,
    PageParams
> = async (ctx) => {
    if (!ctx.params) {
        return {
            redirect: {
                destination: '/404',
                permanent: false
            }
        };
    }
    const { category, subcategory } = ParamsParse.parse(ctx.params);

    if (isNaN(category) || isNaN(subcategory)) {
        return {
            redirect: {
                destination: '/404',
                permanent: false
            }
        };
    }

    const queryClient = new QueryClient();
    try {
        await queryClient.fetchQuery(
            [
                { api: 'cubasuper-api', path: '/backend/v1/product/' },
                { queries: { subcategory } }
            ],
            () =>
                serverApiClient.get('/backend/v1/product/', {
                    queries: {
                        subcategory
                    }
                })
        );
        await queryClient.fetchQuery(
            [{ api: 'cubasuper-api', path: '/backend/v1/category/' }, {}],
            () => serverApiClient.get('/backend/v1/category/')
        );
    } catch (e) {
        return {
            redirect: {
                destination: `${ctx.locale === 'en' ? '/en' : ''}/server-error`,
                permanent: false
            }
        };
    }

    ctx.res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=119'
    );

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            ...(await serverSideTranslations(ctx.locale ?? 'es')),
            category,
            subcategory
        }
    };
};
