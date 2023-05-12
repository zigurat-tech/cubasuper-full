import { AddIcon, DeleteIcon, MinusIcon } from '@chakra-ui/icons';
import {
    Box,
    Center,
    Divider,
    HStack,
    IconButton,
    Text,
    VStack
} from '@chakra-ui/react';
import { useTrans } from '@hooks/useTrans';
import { useAuth, useAuthStore, useProductModal } from '@store/models';
import { ProductDataArray, useCart } from '@store/models/cartDrawer';
import Image from 'next/image';
import React from 'react';
import {env} from "../../../../env";

type CartDrawerProductProps = {
    product: ProductDataArray;
};

export function CartDrawerProduct({ product }: CartDrawerProductProps) {
    const { t, locale } = useTrans();
    const { isLogin } = useAuthStore();
    const { openModal } = useProductModal();
    const { addProductCartById, removeProductCartById, getProductById } =
        useCart();

    async function onClickCartProduct() {
        const data = getProductById(product.id);

        if (data) {
            await openModal({
                productHref: `/product/${data.id}/${
                    locale === 'es' ? data.name : data.name_trans
                }`,
                product: {
                    ...data
                }
            });
        }
    }

    function onAddToCart(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        addProductCartById(product.id!);
    }

    function onRemoveToCart(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        removeProductCartById(product.id!);
    }

    return (
        <HStack
            onClick={onClickCartProduct}
            width={'full'}
            padding={'0.5rem 1rem'}
            spacing={'1rem'}
            cursor={'pointer'}
        >
            <Center
                width={'120px'}
                height={'120px'}
                minWidth={'120px'}
                maxWidth={'120px'}
                position={'relative'}
                borderRadius={'0.5rem'}
                overflow={'hidden'}
            >
                <Image
                    src={env.NEXT_PUBLIC_BACKEND_URL + product.image}
                    alt={'Cart Product'}
                    height={120}
                    width={120}
                    // placeholder={"blur"}
                    // blurDataURL={env.NEXT_PUBLIC_BACKEND_URL + product.image}
                />
                <Box
                    top={0}
                    left={0}
                    width={'full'}
                    height={'full'}
                    backgroundColor={'black'}
                    opacity={0.03}
                    position={'absolute'}
                />
            </Center>

            <VStack height={'full'} width={'full'} alignItems={'start'}>
                <VStack
                    height={'full'}
                    width={'full'}
                    justifyContent={'center'}
                >
                    <Text
                        width={'full'}
                        fontSize={isLogin ? 'lg' : 'xl'}
                        display={'-webkit-box'}
                        textOverflow={'ellipsis'}
                        wordBreak={'break-all'}
                        overflow={'hidden'}
                        sx={{
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {locale === 'es' ? product.name : product.name_trans}
                    </Text>
                    {isLogin && (
                        // <HStack spacing={"0.25rem"} width={"full"}>
                        // 	<Text fontWeight={"bold"}>
                        // 		{(product.price / 100).toFixed(2)} €
                        // 	</Text>
                        // 	<Text>
                        // 		/
                        // 		{locale === "es"
                        // 			? product.unit_of_measurement
                        // 			: product.unit_of_measurement_trans}
                        // 	</Text>
                        // </HStack>
                        <HStack
                            width={'full'}
                            textAlign={'start'}
                            spacing={'0.2rem'}
                        >
                            <Text
                                transition={'font-size .2s ease'}
                                fontWeight={700}
                                wordBreak={'keep-all'}
                                whiteSpace={'nowrap'}
                            >
                                {(product.price / 100).toFixed(2)} €
                            </Text>
                            <Text
                                opacity={0.5}
                                display={'-webkit-box'}
                                textOverflow={'ellipsis'}
                                wordBreak={'break-all'}
                                overflow={'hidden'}
                                sx={{
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical'
                                }}
                            >
                                /
                                {locale === 'es'
                                    ? product.unit_of_measurement
                                    : product.unit_of_measurement_trans}
                            </Text>
                        </HStack>
                    )}
                </VStack>
                <Divider opacity={1} borderColor={'neutral.100'} />
                <HStack
                    width={'full'}
                    height={'full'}
                    justifyContent={'space-between'}
                >
                    <VStack alignItems={'start'} spacing={'0px'}>
                        <Text fontSize={'sm'} opacity={0.8}>
                            {t('cart.product_cart')}
                        </Text>
                        <Text
                            fontSize={'xl'}
                            fontWeight={'bold'}
                            display={'-webkit-box'}
                            textOverflow={'ellipsis'}
                            wordBreak={'break-all'}
                            overflow={'hidden'}
                            sx={{
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {`${product.cant} ${
                                locale === 'es'
                                    ? product.unit_of_measurement
                                    : product.unit_of_measurement_trans
                            }`}
                        </Text>
                    </VStack>
                    <HStack>
                        <IconButton
                            onClick={onRemoveToCart}
                            aria-label={'remove product'}
                            _hover={{
                                color: 'white'
                            }}
                        >
                            {product.cant > 1 ? (
                                <MinusIcon fontSize={'lg'} />
                            ) : (
                                <DeleteIcon fontSize={'lg'} />
                            )}
                        </IconButton>
                        <IconButton
                            onClick={onAddToCart}
                            aria-label={'add product'}
                            _hover={{
                                color: 'white'
                            }}
                        >
                            <AddIcon fontSize={'lg'} />
                        </IconButton>
                    </HStack>
                </HStack>
            </VStack>
        </HStack>
    );
}
