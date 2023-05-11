import dynamic from 'next/dynamic';

export const ProductCardDynamic = dynamic(() => import('./ProductCard'));
