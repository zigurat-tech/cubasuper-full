import { ProductType } from "@api/server";
import { Grid } from "@chakra-ui/react";
import { ProductCardDynamic } from "@components/categories";
import React from "react";

type ProductListProps = {
	results: ProductType[];
};

function ProductList({ results }: ProductListProps) {
	return (
		<Grid
			width={"full"}
			gridTemplateColumns={{
				base: "repeat( auto-fit, minmax(216px, 1fr))",
				md: "repeat( auto-fit, minmax(216px, 235px))",
			}}
			placeItems={{ base: "center", md: "start" }}
			gap={"1rem"}
		>
			{results?.map((product) => (
				<ProductCardDynamic key={product.id} product={product} />
			))}
		</Grid>
	);
}

export default ProductList;
