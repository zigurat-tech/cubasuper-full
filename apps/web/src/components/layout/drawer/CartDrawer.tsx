import {
    Box,
    Button,
    Center,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Heading,
    HStack,
    IconButton,
    StackDivider,
    Text,
    VStack
} from '@chakra-ui/react';
import { CloseIcon, InfoIcon } from '@chakra-ui/icons';
import { useCart } from '@store/models/cartDrawer';
import { CartDrawerProduct } from './CartDrawerProduct';
import { CartDrawerEmptyModal } from './CartDrawerEmptyModal';
import React, { useRef } from 'react';
import Image from 'next/image';
import { useTrans } from '@hooks/useTrans';
import { CartDrawerCheckoutModal } from '@components/layout/drawer/CartDrawerCheckoutModal';
import { useAuth, useAuthStore } from '@store/models';

function CartDrawer() {
    const { isLogin, onOpenModal } = useAuthStore();
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useTrans();

    const { isOpenCart, onCloseCart, productDataArray, getTotalCartPrice } =
        useCart();

    return (
        <Drawer
            isOpen={isOpenCart}
            placement="right"
            onClose={onCloseCart}
            size={'xs'}
            variant={'primary'}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader
                    paddingX={'1rem'}
                    minHeight={'4.5rem'}
                    height={'4.5rem'}
                    borderBottom={'1px solid'}
                    borderColor={'neutral.100'}
                >
                    <HStack height={'full'} justifyContent={'space-between'}>
                        <HStack height={'full'}>
                            <IconButton
                                variant={'ghost'}
                                aria-label={'Close Cart Button'}
                                borderRadius={'50%'}
                                minWidth={'2rem'}
                                height={'2rem'}
                                width={'2rem'}
                                onClick={onCloseCart}
                            >
                                <CloseIcon
                                    height={'0.8rem'}
                                    sx={{ aspectRatio: '1/1' }}
                                />
                            </IconButton>
                            <Heading fontSize={'2xl'}>
                                {t('cart.title')}
                            </Heading>
                        </HStack>
                        {productDataArray.length > 0 && (
                            <CartDrawerEmptyModal />
                        )}
                    </HStack>
                </DrawerHeader>

                <DrawerBody
                    display={'flex'}
                    flexDirection={'column'}
                    width={'full'}
                    padding={'0px'}
                >
                    {productDataArray.length > 0 ? (
                        <>
                            <VStack
                                flex={1}
                                width={'full'}
                                borderBottom={'1px solid'}
                                borderColor={'neutral.100'}
                                divider={
                                    <StackDivider borderColor={'neutral.100'} />
                                }
                                overflowY={'auto'}
                            >
                                {productDataArray.map((product) => (
                                    <CartDrawerProduct
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </VStack>
                        </>
                    ) : (
                        <Center height={'full'} width={'full'}>
                            <VStack height={'full'} maxHeight={'10rem'}>
                                <Center
                                    position={'relative'}
                                    height={'full'}
                                    sx={{ aspectRatio: '1/1' }}
                                >
                                    <Image
                                        fill
                                        src={'/cart/empty_cart.svg'}
                                        alt={'Empty Cart'}
                                    />
                                </Center>
                                <Text textAlign={'center'}>
                                    {t('cart.empty_description_1')}
                                    <br /> {t('cart.empty_description_2')}
                                </Text>
                            </VStack>
                        </Center>
                    )}
                </DrawerBody>

                {productDataArray.length > 0 && (
                    <DrawerFooter>
                        {isLogin ? (
                            <VStack width={'full'}>
                                <HStack
                                    width={'full'}
                                    paddingY={'0.25rem'}
                                    justifyContent={'space-between'}
                                >
                                    <HStack>
                                        <InfoIcon />

                                        <Text>{t('cart.total')}</Text>
                                    </HStack>
                                    <Text fontSize={'xl'} fontWeight={'bold'}>
                                        {getTotalCartPrice().toFixed(2)} €
                                    </Text>
                                </HStack>
                                <CartDrawerCheckoutModal />

                                <Box ref={ref} display={'none'} />
                            </VStack>
                        ) : (
                            <Button
                                borderRadius={'0.5rem'}
                                variant={'secondary'}
                                width={'full'}
                                onClick={() => {
                                    onOpenModal();
                                    onCloseCart();
                                }}
                            >
                                {t('cart.identify')}
                            </Button>
                        )}
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
}
export default CartDrawer;
