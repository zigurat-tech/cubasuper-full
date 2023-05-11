import { DefinitionType } from "@api/server";
import { CheckIcon } from "@chakra-ui/icons";
import {
	Accordion,
	AccordionButton,
	AccordionItem,
	HStack,
	Text,
} from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import { useSearchStore } from "@store/models/search";
import { useRouter } from "next/router";
import React from "react";

type SearchDefinitionProps = {
	data: Omit<DefinitionType, "subcategory">[];
};

export function SearchDefinition({ data }: SearchDefinitionProps) {
	const { locale } = useTrans();
	const router = useRouter();
	const { onChangeLoading } = useSearchStore();

	async function onChangeIndex(definitionId: number, isExpanded: boolean) {
		if (!isExpanded) {
			onChangeLoading(true);
			await router.push(
				{
					pathname: router.pathname,
					query: {
						...router.query,
						definitionId,
					},
				},
				undefined,
				{ locale: router.locale },
			);
			onChangeLoading(false);
		} else {
			const { definitionId, ...restQuery } = router.query;
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
		const { definitionId } = router.query;
		if (
			definitionId &&
			typeof definitionId === "string" &&
			!isNaN(parseInt(definitionId))
		) {
			return data.findIndex((v) => v.id === parseInt(definitionId));
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
						<AccordionButton
							_hover={{ backgroundColor: "transparent" }}
							padding={"0.25rem 0px"}
							onClick={() => onChangeIndex(value.id, isExpanded)}
						>
							<HStack textAlign={"start"} spacing={"4px"}>
								<Text fontWeight={isExpanded ? "bold" : "normal"}>
									{locale === "es" ? value.name : value.name_trans}
								</Text>
								{isExpanded && <CheckIcon fontSize={"xs"} />}
							</HStack>
						</AccordionButton>
					)}
				</AccordionItem>
			))}
		</Accordion>
	);
}
