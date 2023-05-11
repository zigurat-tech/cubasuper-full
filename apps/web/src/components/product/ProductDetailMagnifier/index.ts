import dynamic from 'next/dynamic';

export const ProductModalMagnifierDynamic = dynamic(
    () => import('./ProductModalMagnifier')
);
