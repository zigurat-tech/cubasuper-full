import dynamic from 'next/dynamic';

export const ProductListDynamic = dynamic(
    () => import('./ProductListByDefinition')
);
