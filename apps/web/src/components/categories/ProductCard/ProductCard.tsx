import { ProductType } from '@api/server';
import { AddIcon, DeleteIcon, MinusIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Center,
    Divider,
    HStack,
    IconButton,
    Text,
    VStack
} from '@chakra-ui/react';
import { useTrans } from '@hooks/useTrans';
import { useAuthStore } from '@store/models';
import { useCart } from '@store/models/cartDrawer';
import { useProductModal } from '@store/models/productModal';
import { colors } from '@theme/colors';
import Image from 'next/image';
import React from 'react';

type ProductCardProps = {
    product: ProductType;
};

export default function ProductCard({ product }: ProductCardProps) {
    const { isLogin } = useAuthStore();
    const { openModal } = useProductModal();
    const { t, locale } = useTrans();
    const { addProductCart, getProductById, removeProductCartById } = useCart();

    const productById = getProductById(product.id);

    async function onClickCard(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();

        const modal = document.getElementsByClassName(
            'chakra-modal__content-container'
        );

        if (modal?.[0]) {
            modal[0].scrollTo({ top: 0 });
        }

        await openModal({
            productHref: `/product/${product.id}/${product.name}`,
            product
        });
    }

    function onAddToCart(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        addProductCart(product);
    }

    function onRemoveToCart(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        removeProductCartById(product.id);
    }

    return (
        <VStack
            onClick={onClickCard}
            width={'full'}
            minWidth={'216px'}
            borderRadius={'0.5rem'}
            padding={'1rem'}
            paddingBottom={'0.5rem'}
            marginY={'0.25rem'}
            cursor={'pointer'}
            transition={'box-shadow .2s ease-in-out'}
            boxShadow={`0 0 12px 0 ${colors.boxShadow}`}
            _hover={{
                boxShadow: `0 0 12px 0  ${colors.selectedYellow}`,
                transition: 'all .2s ease-in-out'
            }}
            spacing={'0.1rem'}
        >
            <Center
                width={'full'}
                minWidth={'200px'}
                minHeight={'200px'}
                position={'relative'}
                borderRadius={'0.5rem'}
                overflow={'hidden'}
            >
                <Box
                    position={'relative'}
                    width={'200px'}
                    height={'200px'}
                    sx={{
                        aspectRatio: 1
                    }}
                >
                    <Image
                        src={
                            process.env.NEXT_PUBLIC_BACKEND_URL + product.image
                        }
                        alt={
                            locale === 'es' ? product.name : product.name_trans!
                        }
                        fill
                        // placeholder={"blur"}
                        // blurDataURL={process.env.NEXT_PUBLIC_BACKEND_URL + product.image}
                        loading={'lazy'}
                    />
                </Box>
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
            <VStack
                padding={'0.2rem'}
                width={'full'}
                alignItems={'start'}
                wordBreak={'break-word'}
                height={'full'}
                overflow={'hidden'}
                spacing={'0.2rem'}
            >
                <VStack alignItems={'start'} spacing={'0'}>
                    <Text fontSize={'sm'}>
                        {locale === 'es' ? product.name : product.name_trans!}
                    </Text>
                    <Text
                        height={'2.2rem'}
                        fontSize={'xs'}
                        color={'neutral.200'}
                        display={'-webkit-box'}
                        textOverflow={'ellipsis'}
                        textAlign={'start'}
                        wordBreak={'break-all'}
                        overflow={'hidden'}
                        sx={{
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {locale === 'es'
                            ? product.description
                            : product.description_trans!}
                    </Text>
                </VStack>
                {isLogin && (
                    <HStack textAlign={'start'} spacing={'0.2rem'}>
                        <Text
                            transition={'font-size .2s ease'}
                            fontSize={productById ? 'lg' : 'xl'}
                            fontWeight={700}
                            wordBreak={'keep-all'}
                            whiteSpace={'nowrap'}
                        >
                            {(product.price / 100).toFixed(2)} €
                        </Text>
                        <Text
                            opacity={0.5}
                            fontSize={productById ? 'lg' : 'xl'}
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

            <Divider
                margin={'0px !important'}
                opacity={productById ? 1 : 0}
                borderColor={'neutral.100'}
                transition={'opacity .2s ease'}
            />

            {productById ? (
                <HStack width={'full'} justifyContent={'space-between'}>
                    <VStack
                        alignItems={'start'}
                        spacing={'0px'}
                        display={'-webkit-box'}
                        textOverflow={'ellipsis'}
                        overflow={'hidden'}
                        wordBreak={'break-all'}
                        sx={{
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                        textAlign={'start'}
                    >
                        <Text fontSize={'sm'} opacity={0.8}>
                            {t('cart.product_cart')}
                        </Text>
                        <Text fontSize={'xl'} fontWeight={'bold'}>
                            {`${productById.cant} ${
                                locale === 'es'
                                    ? product.unit_of_measurement
                                    : product.unit_of_measurement_trans
                            }`}
                        </Text>
                    </VStack>
                    <HStack minHeight={'51px'} height={'51px'}>
                        <IconButton
                            onClick={onRemoveToCart}
                            aria-label={'remove product'}
                            _hover={{
                                color: 'white'
                            }}
                        >
                            {productById.cant > 1 ? (
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
            ) : (
                <Center width={'full'} minHeight={'51px'} height={'51px'}>
                    <Button
                        width={'full'}
                        height={'32px'}
                        borderRadius={'0.5rem'}
                        onClick={onAddToCart}
                    >
                        {t('cart.add_to_cart')}
                    </Button>
                </Center>
            )}
        </VStack>
    );
}
