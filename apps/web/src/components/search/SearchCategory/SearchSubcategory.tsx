import { SearchDefinition } from "./SearchDefinition";
import { SubcategoryType } from "@api/server";
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

type SearchSubcategoryProps = {
	data: SubcategoryType[];
};

export function SearchSubcategory({ data }: SearchSubcategoryProps) {
	const { locale } = useTrans();
	const router = useRouter();

	const { onChangeLoading } = useSearchStore();

	async function onChangeIndex(subcategoryId: number, isExpanded: boolean) {
		if (!isExpanded) {
			const { definitionId, ...restQuery } = router.query;

			onChangeLoading(true);
			await router.push(
				{
					pathname: router.pathname,
					query: {
						...restQuery,
						subcategoryId,
					},
				},
				undefined,
				{ locale: router.locale },
			);

			onChangeLoading(false);
		} else {
			const { subcategoryId, definitionId, ...restQuery } = router.query;

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
		const { subcategoryId } = router.query;
		if (
			subcategoryId &&
			typeof subcategoryId === "string" &&
			!isNaN(parseInt(subcategoryId))
		) {
			return data.findIndex((v) => v.id === parseInt(subcategoryId));
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
								onClick={() => onChangeIndex(value.id, isExpanded)}
							>
								<HStack spacing={"4px"}>
									{isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
									<Text fontWeight={isExpanded ? "bold" : "normal"}>
										{locale === "es" ? value.name : value.name_trans}
									</Text>{" "}
									{isExpanded && <CheckIcon fontSize={"xs"} />}
								</HStack>
							</AccordionButton>
							<AccordionPanel padding={"0px 0px 0px 2rem"}>
								<VStack alignItems={"start"} spacing={"0px"}>
									<SearchDefinition
										data={Object.entries(value.definitions).map(
											(definition) => definition[1],
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
