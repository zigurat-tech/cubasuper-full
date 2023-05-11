import {api, apiClient, serverApiClient} from "@api/server";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Page() {
	const { data } = api.useQuery("/backend/v1/about/");
	const { locale } = useTrans();

	return (
		<VStack
			spacing={"0px"}
			// paddingTop={{ base: "8rem", lg: "4.5rem" }}
			minHeight={"100vh"}
		>
			<VStack
				height={"full"}
				alignItems={"start"}
				paddingY={"3rem"}
				paddingX={{ base: "1rem", md: "4rem" }}
				width={"full"}
				spacing={"2rem"}
				overflowY={"auto"}
				textAlign={"start"}
				maxWidth={"150ch"}
			>
				<Heading
					width={"full"}
					fontSize={"5xl"}
					fontWeight={700}
					paddingLeft={"0.5rem"}
					textAlign={"center"}
				>
					{locale === "en" ? "About us" : "Sobre Nosotros"}
				</Heading>
				{data?.map((v) => (
					<VStack key={v.id}>
						<Text>{locale === "es" ? v.info : v.info_trans}</Text>
					</VStack>
				))}
			</VStack>
		</VStack>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const queryClient = new QueryClient();
	try {
		await queryClient.prefetchQuery(
			[{ api: "cubasuper-api", path: "/backend/v1/about/" }, {}],
			() => serverApiClient.get("/backend/v1/about/"),
		);
	} catch (e) {
		return {
			redirect: {
				destination: `${ctx.locale === "en" ? "/en" : ""}/server-error`,
				permanent: false,
			},
		};
	}

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
			...(await serverSideTranslations(ctx.locale ?? "es")),
		},
	};
};
