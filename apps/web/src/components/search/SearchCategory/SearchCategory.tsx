import { SearchSubcategory } from "./SearchSubcategory";
import { CategoryType } from "@api/server";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	HStack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import { useSearchStore } from "@store/models/search";
import { useRouter } from "next/router";
import React from "react";

type SearchCategorySectionProps = {
	data: CategoryType[];
};

export function SearchCategory({ data }: SearchCategorySectionProps) {
	const { locale } = useTrans();
	const router = useRouter();

	const { onChangeLoading } = useSearchStore();

	async function onChangeIndex(categoryId: number, isExpanded: boolean) {
		if (!isExpanded) {
			const { subcategoryId, definitionId, ...restQuery } = router.query;

			onChangeLoading(true);
			await router.push(
				{
					pathname: router.pathname,
					query: {
						...restQuery,
						categoryId,
					},
				},
				undefined,
				{ locale: router.locale },
			);
			onChangeLoading(false);
		} else {
			const { categoryId, subcategoryId, definitionId, ...restQuery } =
				router.query;
			onChangeLoading(true);
			await router.push(
				{
					pathname: router.pathname,
					query: {
						...restQuery,
					},
				},
				undefined,
				{ locale: router.locale },
			);
			onChangeLoading(false);
		}
	}

	function getIndexById() {
		const { categoryId } = router.query;
		if (
			categoryId &&
			typeof categoryId === "string" &&
			!isNaN(parseInt(categoryId))
		) {
			return data.findIndex((v) => v.id === parseInt(categoryId));
		}
	}

	return (
		<Accordion allowToggle width={"full"} defaultIndex={getIndexById()}>
			{data.map((value) => (
				<AccordionItem
					key={value.id}
					width={"full"}
					borderColor={"transparent"}
				>
					{({ isExpanded }) => (
						<>
							<AccordionButton
								_hover={{ backgroundColor: "transparent" }}
								paddingStart={"0.5rem"}
								padding={"0.25rem 0px"}
								onClick={async () => await onChangeIndex(value.id, isExpanded)}
							>
								<HStack spacing={"4px"}>
									{isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
									<Text fontWeight={isExpanded ? "bold" : "normal"}>
										{locale === "es" ? value.name : value.name_trans}
									</Text>
									{isExpanded && <CheckIcon fontSize={"xs"} />}
								</HStack>
							</AccordionButton>
							<AccordionPanel padding={"0px 0px 0px 1rem"}>
								<VStack alignItems={"start"} spacing={"0px"}>
									<SearchSubcategory
										data={Object.entries(value.subcategories).map(
											(subcategory) => subcategory[1],
										)}
									/>
								</VStack>
							</AccordionPanel>
						</>
					)}
				</AccordionItem>
			))}
		</Accordion>
	);
}
