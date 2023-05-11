import { Copyright } from '../copyright/Copyright';
import {
    Container,
    Divider,
    HStack,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';
import { useTrans } from '@hooks/useTrans';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactComponent as CubaSuperLogo } from 'public/cubasuper_logo.svg';
import React from 'react';

export const Footer = () => {
    const router = useRouter();
    const { t } = useTrans();

    return (
        <React.Fragment>
            {!(
                router.pathname.includes('categories') ||
                router.pathname.includes('search-results')
            ) && (
                <React.Fragment>
                    <VStack
                        minHeight={'22rem'}
                        background={'primary'}
                        padding={'2rem'}
                    >
                        <Container height={'full'} maxWidth={'70rem'}>
                            <Divider
                                borderColor={'transparent'}
                                backgroundColor={'white'}
                                opacity={1}
                                borderRadius={'2rem'}
                            />
                            <Stack
                                height={'full'}
                                paddingY={'2rem'}
                                justifyContent={'space-between'}
                                direction={{ base: 'column', md: 'row' }}
                                spacing={{ base: '2rem', lg: '0px' }}
                            >
                                <Stack
                                    direction={'row'}
                                    height={{ base: '64px', md: '14rem' }}
                                    maxHeight={'14rem'}
                                    width={'full'}
                                    sx={{ aspectRatio: '1.5/1' }}
                                    justifyContent={'center'}
                                >
                                    <CubaSuperLogo />
                                </Stack>
                                <Stack
                                    direction={{ base: 'column', md: 'row' }}
                                    paddingX={'2rem'}
                                    width={'full'}
                                    height={'full'}
                                    justifyContent={{
                                        base: 'center',
                                        lg: 'end'
                                    }}
                                    spacing={{ base: '1rem', lg: '5rem' }}
                                    textAlign={'start'}
                                >
                                    <VStack
                                        height={'full'}
                                        spacing={'1.5rem'}
                                        textAlign={{
                                            base: 'center',
                                            md: 'start'
                                        }}
                                    >
                                        <Text width={'full'} color={'selected'}>
                                            {t('footer.products')}
                                        </Text>

                                        <Text
                                            as={Link}
                                            href={'/#news'}
                                            color={'white'}
                                            width={'full'}
                                        >
                                            {t('footer.news')}
                                        </Text>

                                        <Text
                                            as={Link}
                                            href={'/#popular'}
                                            width={'full'}
                                            color={'white'}
                                        >
                                            {t('footer.products')}
                                        </Text>
                                        <Text
                                            as={Link}
                                            href={'/#recommended'}
                                            width={'full'}
                                            color={'white'}
                                        >
                                            {t('footer.recommended')}
                                        </Text>
                                    </VStack>
                                    <VStack
                                        height={'full'}
                                        spacing={'1.5rem'}
                                        textAlign={{
                                            base: 'center',
                                            md: 'start'
                                        }}
                                    >
                                        <Text width={'full'} color={'selected'}>
                                            {t('footer.info')}
                                        </Text>
                                        <Text
                                            as={Link}
                                            href={'/about-us'}
                                            width={'full'}
                                            color={'white'}
                                        >
                                            {t('footer.about')}
                                        </Text>
                                        <Text
                                            as={Link}
                                            href={'/contacts'}
                                            width={'full'}
                                            color={'white'}
                                        >
                                            {t('footer.contacts')}
                                        </Text>
                                    </VStack>
                                    <VStack
                                        height={'full'}
                                        spacing={'1.5rem'}
                                        textAlign={{
                                            base: 'center',
                                            md: 'start'
                                        }}
                                    >
                                        <Text width={'full'} color={'selected'}>
                                            {t('footer.sections')}
                                        </Text>
                                        <Text
                                            as={Link}
                                            href={'/categories'}
                                            width={'full'}
                                            color={'white'}
                                        >
                                            {t('footer.categories')}
                                        </Text>
                                    </VStack>
                                </Stack>
                            </Stack>
                        </Container>
                    </VStack>
                    <Copyright />
                </React.Fragment>
            )}
        </React.Fragment>
    );
};
