import { ProductType } from "@api/server";
import { AddIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import {
	Box,
	Breadcrumb,
	BreadcrumbItem,
	Button,
	Center,
	Divider,
	HStack,
	IconButton,
	Stack,
	Text,
	VStack,
	useToast,
} from "@chakra-ui/react";
import {
	ProductDetailCarrouselDynamic,
	ProductModalMagnifierDynamic,
} from "@components/product";
import { useTrans } from "@hooks/useTrans";
import { useAuthStore, useProductModal } from "@store/models";
import { useCart } from "@store/models/cartDrawer";
import { isMobile } from "@utils/window";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Responsive } from "react-alice-carousel";

type ProductDetailProps = {
	images: string[];
	product: ProductType;
	recommendationsItems: JSX.Element[];
	responsive: Responsive;
	thumbsNumber: number | undefined;
};

export function ProductDetail({
	product,
	images,
	recommendationsItems,
	responsive,
	thumbsNumber,
}: ProductDetailProps) {
	const toast = useToast();
	const { isLogin } = useAuthStore();
	const { t, locale } = useTrans();
	const { closeModal } = useProductModal();
	const { addProductCart, getProductById, removeProductCartById } = useCart();
	const productById = getProductById(product.id);

	function onAddToCart(e: React.MouseEvent<HTMLButtonElement>) {
		e.stopPropagation();
		addProductCart(product);
	}

	function onRemoveToCart(e: React.MouseEvent<HTMLButtonElement>) {
		e.stopPropagation();
		removeProductCartById(product.id);
	}

	async function onShareProduct() {
		await closeModal();
		if (isMobile()) {
			await navigator.share({
				text: `${process.env.NEXT_PUBLIC_URL}/product/${product.id}/${
					locale === "es" ? product.name : product.name_trans
				}`,
				title: t("share_description"),
			});
		} else {
			await navigator.clipboard.writeText(
				`${process.env.NEXT_PUBLIC_URL}/product/${product.id}/${
					locale === "es" ? product.name : product.name_trans
				}`,
			);
			toast({
				title: t("share_description"),
				status: "success",
				variant: "left-accent",
				duration: 2000,
				render: () => (
					<Center
						backgroundColor={"primaryLight"}
						padding={"1rem"}
						borderRadius={"4px"}
					>
						<Text color={"white"}>{t("share_description")}</Text>
					</Center>
				),
			});
		}
	}

	return (
		<VStack width={"full"} alignItems={"start"} spacing={"2rem"}>
			<Breadcrumb separator=">" paddingX={"2rem"} paddingTop={"2rem"}>
				<BreadcrumbItem>
					<Text>
						{locale === "es"
							? product.definition.subcategory.category.name
							: product.definition.subcategory.category.name_trans}
					</Text>
				</BreadcrumbItem>

				<BreadcrumbItem onClick={async () => await closeModal()}>
					<Link
						href={`/categories/${product.definition.subcategory.category.id}/${product.definition.subcategory.id}`}
					>
						<Text fontWeight={"bold"}>
							{locale === "es"
								? product.definition.subcategory.name
								: product.definition.subcategory.name_trans}
						</Text>
					</Link>
				</BreadcrumbItem>
			</Breadcrumb>
			<Stack
				width={"full"}
				alignItems={"start"}
				spacing={"2rem"}
				paddingX={"1.5rem"}
				paddingY={"0px"}
				direction={{ base: "column", lg: "row" }}
			>
				{images && images.length > 0 && (
					<ProductModalMagnifierDynamic images={images} />
				)}

				<VStack flex={1} width={"full"} height={"full"} alignItems={"start"}>
					<VStack paddingBottom={"1rem"} width={"full"} alignItems={"start"}>
						<Text fontSize={"2xl"}>
							{locale === "es" ? product.name : product.name_trans}
						</Text>
						<Text fontSize={"2xl"} opacity={0.7}>
							{locale === "es"
								? product.description
								: product.description_trans}
						</Text>
						{isLogin && (
							<HStack spacing={"1rem"} alignItems={"start"}>
								<Text fontSize={"4xl"} fontWeight={700} whiteSpace={"nowrap"}>
									{`${(product.price / 100).toFixed(2)} €`}
								</Text>

								<Text fontSize={"3xl"} opacity={0.5} paddingTop={"0.3rem"}>
									/
									{locale === "es"
										? product.unit_of_measurement
										: product.unit_of_measurement_trans}
								</Text>
							</HStack>
						)}
					</VStack>
					<Divider backgroundColor={"neutral.100"} />
					<Box paddingY={"0.5rem"}>
						{productById ? (
							<HStack height={"full"} justifyContent={"space-between"}>
								<VStack alignItems={"start"} spacing={"0px"}>
									<Text fontSize={"sm"} opacity={0.8}>
										{t("cart.product_cart")}
									</Text>
									<Text
										fontSize={"xl"}
										fontWeight={"bold"}
										display={"-webkit-box"}
										textOverflow={"ellipsis"}
										wordBreak={"break-all"}
										overflow={"hidden"}
										sx={{
											WebkitLineClamp: 2,
											WebkitBoxOrient: "vertical",
										}}
									>
										{`${productById.cant} ${
											locale === "es"
												? product.unit_of_measurement
												: product.unit_of_measurement_trans
										}`}
									</Text>
								</VStack>
								<HStack>
									<IconButton
										onClick={onRemoveToCart}
										aria-label={"remove product"}
										_hover={{
											color: "white",
										}}
									>
										{productById.cant > 1 ? (
											<MinusIcon fontSize={"lg"} />
										) : (
											<DeleteIcon fontSize={"lg"} />
										)}
									</IconButton>
									<IconButton
										onClick={onAddToCart}
										aria-label={"add product"}
										_hover={{
											color: "white",
										}}
									>
										<AddIcon fontSize={"lg"} />
									</IconButton>
								</HStack>
							</HStack>
						) : (
							<Center width={"full"} minHeight={"51px"} height={"51px"}>
								<Button width={"full"} height={"32px"} onClick={onAddToCart}>
									{t("cart.add_to_cart")}
								</Button>
							</Center>
						)}
					</Box>
					<Divider backgroundColor={"neutral.100"} />
					<Box paddingY={"0.5rem"}>
						<Button
							onClick={onShareProduct}
							leftIcon={
								<Image
									alt={"share icon"}
									src={"/icons/share_icon.svg"}
									height={16}
									width={16}
								/>
							}
						>
							{t("share")}
						</Button>
					</Box>
				</VStack>
			</Stack>
			{!!thumbsNumber && recommendationsItems.length > 0 && (
				<VStack alignItems={"start"} width={"full"}>
					<Text fontWeight={600} paddingLeft={"2rem"}>
						{t("cart.related")}
					</Text>
					<ProductDetailCarrouselDynamic
						thumbs={recommendationsItems}
						thumbsNumber={thumbsNumber}
						responsive={responsive}
					/>
				</VStack>
			)}
		</VStack>
	);
}
