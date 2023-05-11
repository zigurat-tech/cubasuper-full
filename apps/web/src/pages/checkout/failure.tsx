import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Center, Text, VStack } from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import { withLocale } from "@utils/props/withLocale";
import { GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

export default function Page() {
	const router = useRouter();
	const { t } = useTrans();

	async function onGoToHome() {
		await router.push("/categories");
	}

	return (
		<Center
			height={"full"}
			// paddingTop={{ base: "8rem", md: "4.5rem" }}
			minHeight={"100vh"}
		>
			<VStack
				padding={"2rem"}
				spacing={"0.5rem"}
				textAlign={"center"}
				maxWidth={"500px"}
			>
				<Center
					position={"relative"}
					maxWidth={"400px"}
					width={"full"}
					sx={{ aspectRatio: "1/1" }}
				>
					<Image src={"/icons/cancel_icon.svg"} alt={"Cancel Icon"} fill />
				</Center>
				<Text color={"error.200"} fontSize={"1.5rem"}>
					{t("checkout-failure.text")}
				</Text>
				<Button
					variant={"error"}
					rightIcon={<ArrowForwardIcon />}
					onClick={onGoToHome}
				>
					{t("checkout-failure.back")}
				</Button>
			</VStack>
		</Center>
	);
}

export const getStaticProps: GetStaticProps = withLocale;
