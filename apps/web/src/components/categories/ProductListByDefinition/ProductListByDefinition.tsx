import { Heading, VStack } from '@chakra-ui/react';
import React from 'react';
import { ProductType, ResponseProductType } from '@api/server';
import * as R from 'remeda';
import ProductList from '@components/product/ProductList/ProductList';
import { useTrans } from '@hooks/useTrans';

type ProductListProps = {
    products: ResponseProductType;
};

export default function ProductListByDefinition({
    products
}: ProductListProps) {
    const { locale } = useTrans();
    const resultsByDefinition = R.pipe(
        products.results,
        R.groupBy((x: ProductType) =>
            locale === 'es' ? x.definition.name : x.definition.name_trans!
        )
    );

    return (
        <>
            {Object.entries(resultsByDefinition).map(
                ([definition, results]) => (
                    <VStack spacing={'1rem'} width={'full'} key={definition}>
                        <Heading
                            width={'full'}
                            fontSize={'xl'}
                            fontWeight={700}
                            paddingLeft={'0.5rem'}
                        >
                            {definition}
                        </Heading>
                        <ProductList results={results} />
                    </VStack>
                )
            )}
        </>
    );
}
