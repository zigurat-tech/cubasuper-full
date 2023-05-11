import { api } from "@api/server";
import {
	Center,
	Container,
	HStack,
	VStack,
	useBreakpointValue,
} from "@chakra-ui/react";
import ProductCard from "@components/categories/ProductCard/ProductCard";
import { ProductDetail } from "@components/product";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useMemo } from "react";
import { Responsive } from "react-alice-carousel";
import { z } from "zod";

type PageProps = z.infer<typeof ParamsParse>;

export default function Page({
	id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { data: product } = api.useQuery("/backend/v1/product/:id/", {
		params: {
			id,
		},
	});

	const thumbsNumber = useBreakpointValue(
		{
			base: 1,
			sm: 2,
			mdx: 3,
			lg: 4,
		},
		{ ssr: true },
	);

	const responsive: Responsive = useMemo(
		() => ({
			0: {
				items: 1,
			},
			500: {
				items: 2,
			},
			867: {
				items: 3,
			},
			1024: {
				items: 4,
			},
		}),
		[],
	);

	return (
		<HStack
			width={"full"}
			height={"full"}
			minHeight={"100vh"}
			spacing={"0px"}
			// paddingTop={{ base: '8rem', md: '4.5rem' }}
		>
			<VStack
				height={"full"}
				alignItems={"start"}
				width={"full"}
				overflowY={"auto"}
			>
				<Container maxWidth={"lg"} paddingY={"1rem"} paddingBottom={"3rem"}>
					{product?.results[0] && (
						<ProductDetail
							thumbsNumber={thumbsNumber}
							responsive={responsive}
							product={product.results[0]}
							images={[product.results[0].image]}
							recommendationsItems={product.related.map((r) => (
								<Center paddingX={"0.25rem"} key={r.id}>
									<ProductCard product={r} />
								</Center>
							))}
						/>
					)}
				</Container>
			</VStack>
		</HStack>
	);
}

const ParamsParse = z.object({
	id: z.string().transform(Number),
	name: z.string(),
});

export const getServerSideProps: GetServerSideProps<PageProps> = async (
	ctx,
) => {
	if (!ctx.params) {
		return {
			redirect: {
				destination: "/404",
				permanent: false,
			},
		};
	}
	const { id, name } = ParamsParse.parse(ctx.params);

	if (isNaN(id)) {
		return {
			redirect: {
				destination: "/404",
				permanent: false,
			},
		};
	}

	const queryClient = new QueryClient();

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
			...(await serverSideTranslations(ctx.locale ?? "es")),
			name,
			id,
		},
	};
};
