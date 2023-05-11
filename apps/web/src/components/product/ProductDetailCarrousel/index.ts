import dynamic from 'next/dynamic';

export const ProductDetailCarrouselDynamic = dynamic(
    () => import('./ProductDetailCarrousel')
);
