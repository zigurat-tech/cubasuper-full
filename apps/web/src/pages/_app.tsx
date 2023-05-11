import type { AppProps } from 'next/app';
import React, { ReactElement, ReactNode, useState } from 'react';
import {
    ChakraProvider,
    cookieStorageManagerSSR,
    localStorageManager
} from '@chakra-ui/react';
import myTheme from 'theme/theme';
import {
    Hydrate,
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from 'store';
import { SEOHead } from '@components/seo';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NextPage } from 'next';
import { AppLayout } from '@components/layout/AppLayout';
import { getPersistor } from '@rematch/persist';
import { PersistGate } from 'redux-persist/integration/react';
import { appWithTranslation } from 'next-i18next';
import { apiClient } from '@api/server';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const persistor = getPersistor();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const colorModeManager =
        typeof pageProps.cookies === 'string'
            ? cookieStorageManagerSSR(pageProps.cookies)
            : localStorageManager;

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        notifyOnChangeProps: 'all',
                        refetchOnWindowFocus: false
                    }
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <PersistGate persistor={persistor}>
                <Hydrate state={pageProps.dehydratedState}>
                    <ChakraProvider
                        resetCSS
                        theme={myTheme}
                        colorModeManager={colorModeManager}
                    >
                        <Provider store={store}>
                            <SEOHead>
                                <AppLayout>
                                    <Component {...pageProps} />
                                </AppLayout>
                            </SEOHead>
                        </Provider>
                    </ChakraProvider>
                    <ReactQueryDevtools />
                </Hydrate>
            </PersistGate>
        </QueryClientProvider>
    );
}
export default appWithTranslation(MyApp);
