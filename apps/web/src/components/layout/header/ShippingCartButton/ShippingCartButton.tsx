import { Button, Center, HStack, Text } from "@chakra-ui/react";
import { useAuth, useAuthStore } from "@store/models";
import { useCart } from "@store/models/cartDrawer";
import Image from "next/image";

export function ShippingCartButton() {
	const { isLogin } = useAuthStore();
	const {
		onOpenCart,
		productDataArray,
		getTotalCartPrice,
		getTotalCartProducts,
	} = useCart();

	return (
		<Button
			width={
				productDataArray.length > 0 ? { base: "full", sm: "auto" } : "auto"
			}
			paddingY={"0.5rem"}
			paddingX={{ base: "1rem", lg: "0.5rem" }}
			backgroundColor={productDataArray.length > 0 ? "selected" : "transparent"}
			border={productDataArray.length > 0 ? "0.5rem" : "0px"}
			borderRadius={"0.5rem"}
			boxShadow={"none"}
			onClick={onOpenCart}
			_focus={{
				opacity: 1,
				backgroundColor:
					productDataArray.length > 0 ? "selected" : "transparent",
			}}
			_hover={{
				opacity: 1,
				backgroundColor:
					productDataArray.length > 0 ? "selected" : "transparent",
			}}
			transition={"all 0.5s ease"}
		>
			{productDataArray.length > 0 ? (
				<HStack spacing={"0.25rem"}>
					<Image
						alt={"Shopping Cart Icon"}
						src={"/header/shopping-cart-blue.svg"}
						width={24}
						height={24}
					/>
					<Center
						width={getTotalCartProducts() < 100 ? "1.5rem" : "2rem"}
						height={getTotalCartProducts() < 100 ? "1.5rem" : "2rem"}
						borderRadius={"50%"}
						border={"2px solid"}
						borderColor={"white"}
					>
						<Text fontWeight={700} color={"white"}>
							{getTotalCartProducts()}
						</Text>
					</Center>
					{isLogin && (
						<Text fontWeight={700} color={"white"}>
							{getTotalCartPrice().toFixed(2)} $
						</Text>
					)}
				</HStack>
			) : (
				<Image
					alt={"Shopping Cart Icon"}
					src={"/header/shopping-cart.svg"}
					width={24}
					height={24}
				/>
			)}
		</Button>
	);
}
