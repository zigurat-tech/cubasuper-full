import {
    Box,
    Center,
    HStack,
    VStack,
    useBreakpointValue
} from '@chakra-ui/react';
import { ProductDetailCarrouselDynamic } from '@components/product';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { Responsive } from 'react-alice-carousel';
import {
    MOUSE_ACTIVATION,
    Magnifier,
    TOUCH_ACTIVATION
} from 'react-image-magnifiers';

type ProductCardModalMagnifierProps = {
    images: string[];
};

export default function ProductModalMagnifier({
    images
}: ProductCardModalMagnifierProps) {
    const [selectedPreviewImage, setSelectedPreviewImage] = useState<string>(
        images[0]
    );

    useEffect(() => {
        setSelectedPreviewImage(images[0]);
    }, [images]);

    const thumbsNumber = useBreakpointValue(
        {
            base: 2,
            smx: 3,
            sm: 4,
            md: 6,
            lg: 4
        },
        { ssr: true }
    );

    const responsive: Responsive = useMemo(
        () => ({
            0: {
                items: 2
            },
            425: {
                items: 3
            },
            500: {
                items: 4
            },
            767: {
                items: 6
            },
            1024: {
                items: 4
            }
        }),
        []
    );

    const thumbs = images.map((img) => (
        <Center
            key={img}
            minWidth={{ base: '80px', md: '90px' }}
            width={{ base: '80px', md: '90px' }}
            height={{ base: '80px', md: '90px' }}
            paddingX={'1px'}
        >
            <Box
                position={'relative'}
                overflow={'hidden'}
                borderRadius={'0.5rem'}
                width={selectedPreviewImage === img ? '100%' : '70px'}
                height={selectedPreviewImage === img ? '100%' : '70px'}
                minWidth={'70px'}
                cursor={'pointer'}
                onClick={() => {
                    setSelectedPreviewImage(img);
                }}
                transition={'.25s ease-in-out'}
                _hover={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transition: '.25s ease-in-out'
                }}
            >
                <Image
                    src={process.env.NEXT_PUBLIC_BACKEND_URL + img}
                    alt={'Image Product Magnifier'}
                    fill
                    sizes={'80px'}
                    // placeholder={"blur"}
                    // blurDataURL={process.env.NEXT_PUBLIC_BACKEND_URL + img}
                />
            </Box>
        </Center>
    ));

    const [isZoom, setIsZoom] = useState<boolean>(false);
    return (
        <VStack
            maxWidth={{ base: 'full', lg: '50%' }}
            sx={{ aspectRatio: '1/1' }}
            width={{ base: 'full', lg: '50%' }}
            height={'full'}
            position={'relative'}
            backgroundColor={'#f7f8f8'}
            boxShadow={'0 0px 20px 0 rgba(230,229,227,1)'}
            spacing={'1rem'}
        >
            <Box
                as={Magnifier}
                onZoomStart={() => {
                    setIsZoom(true);
                }}
                onZoomEnd={() => {
                    setIsZoom(false);
                }}
                imageSrc={
                    process.env.NEXT_PUBLIC_BACKEND_URL + selectedPreviewImage
                }
                largeImageSrc={
                    process.env.NEXT_PUBLIC_BACKEND_URL + selectedPreviewImage
                }
                imageAlt={'Magnifier Product Image'}
                sx={{
                    width: 'full',
                    aspectRatio: '1/1',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    '& div': {
                        cursor: 'zoom-in !important'
                    }
                }}
                cursorStyle={'zoom-in'}
                mouseActivation={MOUSE_ACTIVATION.CLICK}
                touchActivation={TOUCH_ACTIVATION.TAP}
                dragToMove={false}
            />
            {!isZoom && (
                <HStack
                    bottom={0}
                    left={0}
                    width={'full'}
                    overflowY={'hidden'}
                    overflowX={'hidden'}
                    padding={'1rem'}
                    position={'absolute'}
                    spacing={'0px'}
                >
                    {!!thumbsNumber && (
                        <ProductDetailCarrouselDynamic
                            thumbs={thumbs}
                            responsive={responsive}
                            thumbsNumber={thumbsNumber}
                        />
                    )}
                </HStack>
            )}
        </VStack>
    );
}
