import { BannerType } from '@api/server';
import { Container, Flex, HStack } from '@chakra-ui/react';
import Image from 'next/image';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import {env} from "../../../env";

type HomeBannerProps = {
    data: BannerType[];
};

export default function HomeBanner({ data }: HomeBannerProps) {
    return (
        <Container
            // height={"22rem"}
            // maxHeight={"22rem"}
            maxWidth={'full'}
            padding={'0px'}
            sx={{ aspectRatio: '3.6/1' }}
        >
            <Flex
                width={'full'}
                height={'full'}
                alignItems={'center'}
                justifyContent={'center'}
                position={'relative'}
                overflow={'hidden'}
            >
                <AliceCarousel
                    disableButtonsControls
                    disableDotsControls={data.length === 1}
                    animationDuration={2000}
                    animationType={'fadeout'}
                    infinite
                    autoPlay
                    autoPlayStrategy={'none'}
                    autoPlayInterval={3000}
                    items={data.map(({ id, image }) => (
                        <HStack
                            key={id}
                            // height={"full"}
                            sx={{ aspectRatio: '3.6/1' }}
                            padding={{ base: '1rem', md: '3rem 5rem' }}
                            position={'relative'}
                        >
                            <Image
                                src={`${env.NEXT_PUBLIC_BACKEND_URL}${image}`}
                                alt={'HomeBanner Offer'}
                                fill
                                priority
                                // placeholder={'blur'}
                                // blurDataURL={`${env.NEXT_PUBLIC_BACKEND_URL}${image}`}
                            />
                        </HStack>
                    ))}
                />
            </Flex>
        </Container>
    );
}
