import Head from 'next/head';
import Script from 'next/script';
import React from 'react';
import {env} from "../../env";

type HeadProps = {
    children?: React.ReactNode;
};

const SEOHead: React.FC<HeadProps> = ({ children }) => {
    return (
        <>
            <Head>
                <title>CubaSuper</title>
                <meta
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
                    name="viewport"
                />
                <meta name="description" content="Cubasuper marketplace." />

                {/*The four required properties for every page*/}
                <meta property="og:title" content="Cuba Super" />
                <meta property="og:type" content="website" />
                <meta
                    property="og:image"
                    itemProp="image"
                    content={`${env.NEXT_PUBLIC_URL}/cubasuper_logo.png`}
                />
                <meta
                    property="og:image:secure_url"
                    itemProp="image"
                    content={`${env.NEXT_PUBLIC_URL}/cubasuper_logo.png`}
                />
                <meta
                    property="og:description"
                    content="Cubasuper marketplace."
                />
                <meta property="og:url" content={env.NEXT_PUBLIC_URL} />

                <meta name="twitter:card" content="summary" />
                <meta
                    property="twitter:url"
                    content="https://cuba-super-frontend.vercel.app/"
                />
                <meta property="twitter:title" content="CubaSuper" />
                <meta
                    property="twitter:description"
                    content="Cubasuper marketplace."
                />
                <meta
                    name="twitter:image"
                    content={`${env.NEXT_PUBLIC_URL}/cubasuper_logo.png`}
                />

                <link rel="shortcut icon" href="/favicon.svg" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/favicon.svg" />
                <link rel="canonical" href={env.NEXT_PUBLIC_URL} />
            </Head>
            {/*<Script*/}
            {/*    strategy={'lazyOnload'}*/}
            {/*    src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}*/}
            {/*/>*/}

            {/*<Script*/}
            {/*    id="gtag-init"*/}
            {/*    strategy={'lazyOnload'}*/}
            {/*    dangerouslySetInnerHTML={{*/}
            {/*        __html: `*/}
            {/*    window.dataLayer = window.dataLayer || [];*/}
            {/*    function gtag(){dataLayer.push(arguments);}*/}
            {/*    gtag('js', new Date());*/}
            {/*    gtag('config', '${env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {*/}
            {/*       page_path: window.location.pathname,*/}
            {/*    });`*/}
            {/*    }}*/}
            {/*/>*/}
            {children}
        </>
    );
};

export { SEOHead };
