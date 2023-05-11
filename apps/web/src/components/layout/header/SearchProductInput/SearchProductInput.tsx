import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Spinner,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTrans } from "@hooks/useTrans";
import { useEffectOnce } from "@hooks/utils";
import { useSearchStore } from "@store/models/search";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SearchForm = z.object({
	query: z.string(),
});

type SearchFormType = z.infer<typeof SearchForm>;

export function SearchProductInput() {
	const router = useRouter();
	const { t } = useTrans();

	const [loading, setLoading] = useState<boolean>(false);

	const { onChangeQuery, onChangeBeforeUrl, beforeUrl } = useSearchStore();
	const { register, watch, handleSubmit, setValue } = useForm<SearchFormType>({
		reValidateMode: "onSubmit",
		resolver: zodResolver(SearchForm),
		defaultValues: {
			query: router.query.query ? (router.query.query as string) : undefined,
		},
	});

	const query = watch("query");

	useEffect(() => {
		if (!router.asPath.includes("search-results")) {
			setValue("query", "");
			onChangeQuery("");
			onChangeBeforeUrl(router.asPath);
		}
	}, [onChangeBeforeUrl, onChangeQuery, router.asPath, setValue]);

	useEffectOnce(() => {
		if (!router.asPath.includes("search-results") && query === undefined) {
			onChangeBeforeUrl(router.asPath);
		}
	});

	// const effect = useCallback(async () => {
	// 	if (router.route === "/404" && router.route !== router.asPath) {
	// 		await router.push("/404");
	// 		return;
	// 	}
	// 	if (query && query.length > 2) {
	// 		const { category, subcategory, ...rest } = router.query;
	// 		await router.push(
	// 			{
	// 				pathname: "/search-results",
	// 				query: {
	// 					...rest,
	// 					query,
	// 				},
	// 			},
	// 			undefined,
	// 			{
	// 				locale: router.locale,
	// 			},
	// 		);

	// 		if (!router.asPath.includes("search-results")) {
	// 			onChangeBeforeUrl(router.asPath);
	// 		}
	// 		onChangeQuery(query);
	// 	} else {
	// 		await router.push(
	// 			{
	// 				pathname: beforeUrl,
	// 			},
	// 			undefined,
	// 			{ locale: router.locale },
	// 		);
	// 		onChangeQuery("");
	// 	}
	// }, [query]);

	// useEffect(() => {
	// 	const timeout = setTimeout(async () => await effect(), 300);
	// 	return () => {
	// 		clearTimeout(timeout);
	// 	};
	// }, [query]);

	async function onSubmit(data: SearchFormType) {
		if (data.query) {
			const { category, subcategory, ...rest } = router.query;
			await router.push(
				{
					pathname: "/search-results",
					query: { ...rest, query },
				},
				undefined,
				{ locale: router.locale },
			);
			onChangeQuery(data.query);
			if (!router.asPath.includes("search-results")) {
				onChangeBeforeUrl(router.asPath);
			}
		} else {
			await router.push(
				{
					pathname: beforeUrl,
				},
				undefined,
				{ locale: router.locale },
			);
			onChangeQuery("");
		}
	}

	async function onCloseSearch() {
		setLoading(true);
		onChangeQuery("");
		setValue("query", "");
		await router.push(
			{
				pathname: beforeUrl,
			},
			undefined,
			{ locale: router.locale },
		);
		setLoading(false);
	}

	const timerRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		return () => clearTimeout(timerRef.current);
	}, []);

	async function onChangeText(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;

		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(async () => {
			if (value && value.length > 2) {
				const { category, subcategory, ...rest } = router.query;

				setLoading(true);

				await router.push(
					{
						pathname: "/search-results",
						query: {
							...rest,
							query: value,
						},
					},
					undefined,
					{
						locale: router.locale,
					},
				);

				setLoading(false);
				if (!router.asPath.includes("search-results")) {
					onChangeBeforeUrl(router.asPath);
				}
				onChangeQuery(value);
			} else {
				await router.push(
					{
						pathname: beforeUrl,
					},
					undefined,
					{ locale: router.locale },
				);
				onChangeQuery("");
			}
		}, 300);
	}

	return (
		<InputGroup
			as={"form"}
			maxWidth={{ base: "auto", lg: "25rem" }}
			size={"sm"}
			onSubmit={handleSubmit(onSubmit)}
		>
			<InputLeftElement
				pointerEvents="none"
				backgroundColor={"selected"}
				borderStartRadius={"0.5rem"}
			>
				<SearchIcon color={"white"} />
			</InputLeftElement>
			<Input
				autoFocus
				{...register("query", {
					onChange: onChangeText,
				})}
				type={"text"}
				placeholder={t("header.search_placeholder")}
				borderRadius={"0.5rem"}
				backgroundColor={"neutral.50"}
				paddingLeft={"2.5rem"}
			/>
			<InputRightElement>
				<AnimatePresence>
					{loading ? (
						<Spinner
							marginRight={"2.5"}
							speed='0.65s'
							color='selected'
							size='md'
							minWidth={"6"}
						/>
					) : (
						<IconButton
							aria-label={"search icon button"}
							variant={"ghost"}
							borderRadius={"50%"}
							width={"2rem"}
							height={"2rem"}
							minWidth={"0px"}
							onClick={onCloseSearch}
						>
							<CloseIcon color={"gray.400"} fontSize={"sm"} />
						</IconButton>
					)}
				</AnimatePresence>
			</InputRightElement>
		</InputGroup>
	);
}
