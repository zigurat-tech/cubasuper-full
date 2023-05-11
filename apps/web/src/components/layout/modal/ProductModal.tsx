import { api } from "@api/server";
import {
	Center,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	useBreakpointValue,
} from "@chakra-ui/react";
import ProductCard from "@components/categories/ProductCard/ProductCard";
import { ProductDetail } from "@components/product";
import { useProductModal } from "@store/models";
import React, { useMemo } from "react";
import { Responsive } from "react-alice-carousel";

export default function ProductModal() {
	const { isOpen, closeModal, product } = useProductModal();

	const { data: productById } = api.useQuery(
		"/backend/v1/product/:id/",
		{
			params: {
				id: product?.id!,
			},
		},
		{
			enabled: !!product,
		},
	);

	const thumbsNumber = useBreakpointValue(
		{
			base: 1,
			sm: 2,
			mdx: 3,
			lg: 4,
		},
		{ ssr: true },
	);

	const responsive: Responsive = useMemo(
		() => ({
			0: {
				items: 1,
			},
			500: {
				items: 2,
			},
			867: {
				items: 3,
			},
			1024: {
				items: 4,
			},
		}),
		[],
	);

	return (
		<Modal
			size={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
			isOpen={isOpen}
			onClose={closeModal}
		>
			<ModalOverlay />
			<ModalContent width={"full"} flex={1} paddingBottom={"1rem"}>
				<ModalCloseButton borderRadius={"50%"} />
				<ModalBody padding={"1rem"}>
					{product && (
						<ProductDetail
							thumbsNumber={thumbsNumber}
							responsive={responsive}
							product={product}
							images={[product.image, ...product.gallery]}
							recommendationsItems={
								productById
									? productById.related.map((r) => (
											<Center paddingX={"0.25rem"} key={r.id}>
												<ProductCard product={r} />
											</Center>
									  ))
									: []
							}
						/>
					)}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
