import { Checkbox, HStack } from "@chakra-ui/react";
import { useSearchStore } from "@store/models/search";
import { useRouter } from "next/router";
import React from "react";

type SearchBrandProps = {
	name: string;
};

export function SearchBrand({ name }: SearchBrandProps) {
	const router = useRouter();
	const { brand, ...restQuery } = router.query;
	const { onChangeLoading } = useSearchStore();

	function addBrand() {
		if (!brand) {
			return [name];
		}
		if (typeof brand === "string" && brand !== name) {
			return [brand, name];
		}
		if (typeof brand === "object" && !brand.includes(name)) {
			return [...brand, name];
		}

		return brand;
	}

	function removeBrand() {
		if (typeof brand === "string" && brand === name) {
			return undefined;
		}
		if (typeof brand === "object" && brand.includes(name)) {
			return brand.filter((b) => b !== name);
		}

		return undefined;
	}

	async function onChangeCheck(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.checked) {
			onChangeLoading(true);
			await router.push(
				{
					pathname: router.pathname,
					query: {
						...restQuery,
						brand: addBrand(),
					},
				},
				undefined,
				{ locale: router.locale },
			);

			onChangeLoading(false);
		} else {
			onChangeLoading(true);
			await router.push(
				{
					pathname: router.pathname,
					query: removeBrand()
						? {
								...restQuery,
								brand: removeBrand(),
						  }
						: restQuery,
				},
				undefined,
				{ locale: router.locale },
			);

			onChangeLoading(false);
		}
	}

	function onExistInQuery() {
		if (!brand) {
			return false;
		}
		if (typeof brand === "string" && brand === name) {
			return true;
		}
		if (typeof brand === "object" && brand.includes(name)) {
			return true;
		}
	}

	return (
		<HStack width={"full"}>
			<Checkbox
				width={"full"}
				size={"lg"}
				defaultChecked={onExistInQuery()}
				onChange={onChangeCheck}
				sx={{
					display: "flex",
					flexDirection: "row-reverse",
					justifyContent: "space-between",
					marginStart: "-0.5rem",
					"& .chakra-checkbox__control[data-checked]": {
						backgroundColor: "selected !important",
						borderColor: "selected !important",
					},
				}}
			>
				{name}
			</Checkbox>
		</HStack>
	);
}
