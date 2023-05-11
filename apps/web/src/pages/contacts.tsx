import {api, apiClient, serverApiClient} from "@api/server";
import { HStack, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Page() {
	const { data } = api.useQuery("/backend/v1/contact/");
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
					{locale === "en" ? "Contacts" : "Contactos"}
				</Heading>
				<Stack
					justifyContent={"center"}
					width={"full"}
					flexDirection={"row"}
					flexWrap={"wrap"}
					gap={"2rem"}
				>
					{data?.map((v) => (
						<VStack
							height={"full"}
							width={"17rem"}
							key={v.email}
							border={"1px solid black"}
							borderRadius={"0.5rem"}
							boxShadow={"lg"}
							padding={"2rem"}
							marginTop={"0px !important"}
							transition={"0.5s"}
							_hover={{
								transition: "0.5s",
								boxShadow: "2xl",
							}}
							cursor={"pointer"}
						>
							<Text>{v.name}</Text>
							<Text>{v.last_name}</Text>
							<Text>{v.get_full_name}</Text>
							<Text>{v.email}</Text>
							<Text>{v.phone_number}</Text>
						</VStack>
					))}
				</Stack>
			</VStack>
		</VStack>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const queryClient = new QueryClient();
	try {
		await queryClient.prefetchQuery(
			[{ api: "cubasuper-api", path: "/backend/v1/contact/" }, {}],
			() => serverApiClient.get("/backend/v1/contact/"),
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
