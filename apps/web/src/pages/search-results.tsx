import {CategoryType, api, apiClient, serverApiClient} from '@api/server';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Divider,
    HStack,
    Heading,
    Spinner,
    Stack,
    VStack,
    useMediaQuery
} from '@chakra-ui/react';
import { Copyright } from '@components/layout/copyright/Copyright';
import ProductList from '@components/product/ProductList/ProductList';
import SearchPanel from '@components/search/SearchPanel';
import { useTrans } from '@hooks/useTrans';
import { useSearchStore } from '@store/models/search';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { z } from 'zod';

interface PageProps {
    query: string;
    category?: number;
    definition?: number;
    subcategory?: number;
    brand?: string;
}

export default function Page({
    query,
    brand,
    category,
    subcategory,
    definition
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { t } = useTrans();
    const { data: search } = api.useQuery(
        '/backend/v1/search/:query/',
        {
            params: {
                query
            },
            queries: {
                brand,
                category,
                subcategory,
                definition
            }
        },
        { keepPreviousData: true }
    );

    const [isLargerThan1024] = useMediaQuery('(min-width: 1023px)', {
        ssr: true,
        fallback: true
    });

    const { isLoading } = useSearchStore();

    return (
        <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={'0px'}
            // paddingTop={{ base: "8rem", lg: "4.5rem" }}
            maxHeight={'calc(100vh - 72px)'}
            height={'full'}
            overflowY={'hidden'}
        >
            {search && (
                <React.Fragment>
                    {isLargerThan1024 ? (
                        <SearchPanel
                            categories={Object.entries(search.tree).map(
                                (category) => category[1] as CategoryType
                            )}
                            brands={search.brands}
                        />
                    ) : (
                        <Accordion width={'full'} allowToggle={true}>
                            <AccordionItem>
                                <h2>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            {t('search.mobile_filter')}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>
                                <AccordionPanel padding={'0px'}>
                                    <SearchPanel
                                        categories={Object.entries(
                                            search.tree
                                        ).map(
                                            (category) =>
                                                category[1] as CategoryType
                                        )}
                                        brands={search.brands}
                                    />
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    )}
                </React.Fragment>
            )}

            <Divider
                orientation={'vertical'}
                display={{ base: 'none', lg: 'initial' }}
            />
            <Divider
                orientation={'horizontal'}
                display={{ base: 'initial', lg: 'none' }}
            />
            {search && (
                <VStack
                    alignItems={'start'}
                    paddingY={'3rem'}
                    paddingX={{ base: '1.5rem', lg: '4rem' }}
                    width={'full'}
                    spacing={'2rem'}
                    overflowY={'auto'}
                >
                    <HStack height={'1.5rem'} minHeight={'1.5rem'}>
                        <Heading
                            width={'full'}
                            fontSize={'lg'}
                            fontWeight={700}
                            paddingLeft={'0.5rem'}
                        >
                            {`${t('search.title_part1')} ${
                                search.products.length
                            } ${t('search.title_part2')} ${` "${query}"`}`}
                        </Heading>
                        {isLoading && (
                            <Spinner
                                marginRight={'2.5'}
                                speed="0.65s"
                                color="selected"
                                size="md"
                                minWidth={'6'}
                            />
                        )}
                    </HStack>

                    <Divider backgroundColor={'neutral.100'} />
                    <ProductList results={search.products} />
                    <Copyright />
                </VStack>
            )}
        </Stack>
    );
}

const QueryParse = z.object({
    query: z.string().optional(),
    brand: z.string().array().or(z.string()).optional(),
    categoryId: z.string().nullish().optional().transform(Number),
    subcategoryId: z.string().nullish().optional().transform(Number),
    definitionId: z.string().nullish().optional().transform(Number)
});

export const getServerSideProps: GetServerSideProps<PageProps> = async (
    ctx
) => {
    const { query, brand, categoryId, definitionId, subcategoryId } =
        QueryParse.parse(ctx.query);

    if (!query) {
        return {
            redirect: {
                destination: '/404',
                permanent: false
            }
        };
    }
    const queries: Record<
        keyof Omit<z.infer<typeof QueryParse>, 'query'> | string,
        string | number
    > = {};

    if (brand) {
        queries['brand'] = typeof brand === 'object' ? brand.join(';') : brand;
    }
    if (categoryId) {
        queries['category'] = categoryId;
    }
    if (subcategoryId) {
        queries['subcategory'] = subcategoryId;
    }
    if (definitionId) {
        queries['definition'] = definitionId;
    }

    const queryClient = new QueryClient();

    try {
        await queryClient.fetchQuery(
            [
                { api: 'cubasuper-api', path: '/backend/v1/search/:query/' },
                {
                    params: {
                        query
                    },
                    queries
                }
            ],
            () =>
                serverApiClient.get('/backend/v1/search/:query/', {
                    params: {
                        query
                    },
                    queries
                })
        );
    } catch (e) {
        return {
            redirect: {
                destination: `${ctx.locale === 'en' ? '/en' : ''}/server-error`,
                permanent: false
            }
        };
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            ...(await serverSideTranslations(ctx.locale ?? 'es')),
            query,
            ...queries
        }
    };
};
