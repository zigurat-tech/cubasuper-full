import dynamic from 'next/dynamic';

export const ProductModalDynamic = dynamic(() => import('./ProductModal'));
