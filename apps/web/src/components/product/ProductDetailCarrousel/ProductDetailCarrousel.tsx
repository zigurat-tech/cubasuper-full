import { Center, HStack, IconButton } from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import AliceCarousel, { Responsive } from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

type ProductCardModalRecommendationsProps = {
	thumbs: JSX.Element[];
	thumbsNumber: number;
	responsive: Responsive;
};

export default function ProductDetailCarrousel({
	thumbs,
	thumbsNumber,
	responsive,
}: ProductCardModalRecommendationsProps) {
	const [thumbIndex, setThumbIndex] = useState(0);

	const slideNext = () => {
		if (thumbsNumber) {
			if (thumbIndex === 0) {
				setThumbIndex(thumbsNumber);
			}

			if (thumbIndex !== 0 && thumbIndex + thumbsNumber < thumbs.length) {
				setThumbIndex(thumbIndex + thumbsNumber);
			}
		}
	};

	const slidePrev = () => {
		if (thumbsNumber) {
			if (thumbIndex !== 0 && thumbIndex - thumbsNumber < thumbs.length) {
				setThumbIndex(thumbIndex - thumbsNumber);
			}
		}
	};

	const onSlideChanged = (e: { item: number }) => {
		setThumbIndex(e.item);
	};

	return (
		<HStack
			width={"full"}
			overflow={"hidden"}
			justifyContent={"center"}
			spacing={"0px"}
		>
			{thumbs.length > thumbsNumber && (
				<IconButton
					disabled={thumbIndex === 0}
					aria-label={"back carrousel"}
					onClick={slidePrev}
					variant={"unstyled"}
					minWidth={"24px"}
				>
					<Image
						priority
						alt={"back carrousel"}
						src={"/icons/arrow_back_icon.svg"}
						width={24}
						height={24}
					/>
				</IconButton>
			)}

			<Center
				width={"full"}
				overflow={"hidden"}
				position={"relative"}
				sx={{
					"& li": {
						width: `calc(100%/${thumbsNumber}) !important`,
					},
				}}
			>
				<AliceCarousel
					activeIndex={thumbIndex}
					disableButtonsControls
					disableDotsControls
					animationDuration={1000}
					responsive={responsive}
					items={thumbs}
					onSlideChanged={onSlideChanged}
				/>
			</Center>
			{thumbs.length > thumbsNumber && (
				<IconButton
					disabled={thumbs.length - thumbIndex <= thumbsNumber}
					aria-label={"next arrow carrousel"}
					onClick={slideNext}
					variant={"unstyled"}
					minWidth={"24px"}
				>
					<Image
						priority
						alt={"back carrousel"}
						src={"/icons/arrow_forward_icon.svg"}
						width={24}
						height={24}
					/>
				</IconButton>
			)}
		</HStack>
	);
}
