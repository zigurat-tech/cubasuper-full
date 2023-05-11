import { CheckoutPostType, apiClient } from "@api/server";
import { ArrowForwardIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { Button, Center, Text, VStack } from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import { useEffectOnce } from "@hooks/utils";
import { useAuthStore } from "@store/models";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { z } from "zod";

export default function Page({
	data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const { t, locale } = useTrans();
	const { user, onLogin } = useAuthStore();

	async function onGoToHome() {
		await router.push("/categories");
	}

	async function onCheckout() {
		if (user) {
			await apiClient.post("/backend/v1/checkout/", data, {
				headers: {
					Authorization: `Bearer ${user.access}`,
				},
			});
		}
	}

	useEffectOnce(() => {
		(async () => {
			if (user) {
				try {
					await onCheckout();
				} catch (error) {
					console.log(error);

					try {
						const { access } = await apiClient.post(
							"/backend/v1/token/refresh/",
							{ refresh: user.refresh },
						);
						onLogin({ ...user, access });
						await onCheckout();
					} catch (error) {
						router.push(`${locale === "en" ? "/en" : ""}/server-error`);
					}
				}
			}
		})();
	});

	return (
		<Center
			height={"full"}
			// paddingTop={{ base: "8rem", md: "4.5rem" }}
			minHeight={"100vh"}
		>
			<VStack
				padding={"2rem"}
				spacing={"1rem"}
				maxWidth={"500px"}
				textAlign={"center"}
			>
				<CheckCircleIcon
					height={"full"}
					maxWidth={"400px"}
					width={"full"}
					color={"green"}
					sx={{ aspectRatio: "1.5/1" }}
				/>
				<Text color={"green"} fontSize={"1.5rem"}>
					{t("checkout-success.text")}
				</Text>
				<Button
					variant={"success"}
					rightIcon={<ArrowForwardIcon />}
					onClick={onGoToHome}
				>
					{t("checkout-success.back")}
				</Button>
			</VStack>
		</Center>
	);
}

const QueryParse = z.object({
	data: z
		.string()
		.transform(
			(data) => JSON.parse(decodeURIComponent(data)) as CheckoutPostType,
		),
});

type ReturnProps = z.infer<typeof QueryParse>;

export const getServerSideProps: GetServerSideProps<ReturnProps> = async (
	ctx,
) => {
	if (!ctx.query) {
		return {
			redirect: {
				destination: `${ctx.locale === "en" ? "/en" : ""}/server-error`,
				permanent: false,
			},
		};
	}
	const queries = QueryParse.safeParse(ctx.query);

	if (!queries.success) {
		return {
			redirect: {
				destination: `${ctx.locale === "en" ? "/en" : ""}/server-error`,
				permanent: false,
			},
		};
	}

	return {
		props: {
			...(await serverSideTranslations(ctx.locale ?? "es")),
			data: queries.data.data,
		},
	};
};
