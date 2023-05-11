import { SearchBrand } from "./SearchBrand";
import { SearchCategory } from "./SearchCategory";
import { CategoryType } from "@api/server";
import { Text, VStack } from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import React from "react";

type SearchPanelProps = {
	brands: string[];
	categories: CategoryType[];
};
export default function SearchPanel({ brands, categories }: SearchPanelProps) {
	const { t } = useTrans();

	return (
		<VStack
			height={{ base: "full", lg: "full" }}
			minWidth={"300px"}
			width={{ base: "full", lg: "300px" }}
			padding={"3rem 2rem"}
			overflowY={"auto"}
			spacing={"2rem"}
		>
			<VStack width={"full"} alignItems={"start"} justifyContent={"start"}>
				<Text fontWeight={"bold"}>{t("search.category")}</Text>
				{categories && categories.length > 0 ? (
					<SearchCategory data={categories} />
				) : (
					<Text>{t("search.category_empty")}</Text>
				)}
			</VStack>
			<VStack width={"full"} alignItems={"start"} justifyContent={"start"}>
				<Text fontWeight={"bold"}>{t("search.brand")}</Text>
				<VStack width={"full"}>
					{brands && brands.length > 0 ? (
						brands.map((name, index) => (
							<SearchBrand key={`${name}.${index}`} name={name} />
						))
					) : (
						<Text width={"full"}>{t("search.brand_empty")}</Text>
					)}
				</VStack>
			</VStack>
		</VStack>
	);
}
