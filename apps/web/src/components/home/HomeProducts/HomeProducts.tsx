import { ProductType } from "@api/server";
import {
	Center,
	Container,
	Grid,
	Heading,
	Text,
	VStack,
} from "@chakra-ui/react";
import { ProductCardDynamic } from "@components/categories";

type HomeProductsProps = {
	id: string;
	title: string;
	description: string;
	data: ProductType[];
};

export default function HomeProducts({
	id,
	data,
	title,
	description,
}: HomeProductsProps) {
	return (
		<Container id={id} maxWidth={"2xl"} padding={{ base: "1rem", md: "3rem" }}>
			<VStack
				width={"full"}
				minHeight={"22rem"}
				height={"full"}
				spacing={"1rem"}
				textAlign={"center"}
			>
				<Heading>{title}</Heading>
				<Text fontWeight={600}>{description}</Text>
				<Center width={"full"} height={"full"} maxWidth={"xl"}>
					<Grid
						width={"full"}
						maxWidth={"xl"}
						gridTemplateColumns={"repeat( auto-fit, minmax(13.5rem, 19%))"}
						placeItems={"center"}
						gap={"1rem"}
						justifyContent={"center"}
					>
						{data.map((product) => (
							<ProductCardDynamic product={product} key={product.id} />
						))}
					</Grid>
				</Center>
			</VStack>
		</Container>
	);
}
