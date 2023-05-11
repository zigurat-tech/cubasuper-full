import {api, apiClient, serverApiClient} from '@api/server';
import { Center, Text, VStack } from '@chakra-ui/react';
import {
    HomeBanner,
    HomeBannerDynamic,
    HomeProducts,
    HomeProductsDynamic
} from '@components/home';
import { useTrans } from '@hooks/useTrans';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Page() {
    const { t } = useTrans();
    const { data, isLoading } = api.useQuery('/backend/v1/index/');

    if (!data) {
        return (
            <VStack
                spacing={'0px'}
                height={'full'}
                paddingTop={{ base: '8rem', lg: '4.5rem' }}
                minHeight={'100vh'}
                backgroundColor={'#f2f0f1'}
            >
                <Center height={'full'}>
                    <Text>{isLoading ? '...' : 'No data'}</Text>
                </Center>
            </VStack>
        );
    }

    return (
        <VStack
            spacing={'0px'}
            // paddingTop={{ base: "8rem", lg: "4.5rem" }}
            minHeight={'100vh'}
        >
            <HomeBanner
                data={data.results.banners.filter(
                    (b) => b.position === 1 && b.visible
                )}
            />
            <HomeProducts
                id={'news'}
                title={t('index.news_title')}
                description={t('index.news_description')}
                data={data.results.novedades}
            />
            <HomeBannerDynamic
                data={data.results.banners.filter(
                    (b) => b.position === 2 && b.visible
                )}
            />
            <HomeProductsDynamic
                id={'popular'}
                title={t('index.popular_title')}
                description={t('index.popular_description')}
                data={data.results.populares}
            />
            <HomeBannerDynamic
                data={data.results.banners.filter(
                    (b) => b.position === 3 && b.visible
                )}
            />
            <HomeProductsDynamic
                id={'recommended'}
                title={t('index.recommended_title')}
                description={t('index.recommended_description')}
                data={data.results.recomendados}
            />
        </VStack>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const queryClient = new QueryClient();
    try {
        await queryClient.prefetchQuery(
            [{ api: 'cubasuper-api', path: '/backend/v1/index/' }, {}],
            () => serverApiClient.get('/backend/v1/index/')
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
            ...(await serverSideTranslations(ctx.locale ?? 'es'))
        }
    };
};
