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
		await router.push("/");
	}

	return (
		<Center
			height={"full"}
			// paddingTop={{ base: '8rem', md: '4.5rem' }}
			minHeight={"100vh"}
		>
			<VStack padding={"2rem"} spacing={"1rem"} width={"510px"}>
				<Center
					position={"relative"}
					width={"full"}
					sx={{ aspectRatio: "2/1" }}
				>
					<Image src={"/images/404.png"} alt={"404"} fill />
				</Center>
				<Text>{t("404.title")}</Text>
				<Button
					variant={"secondary"}
					rightIcon={<ArrowForwardIcon />}
					onClick={onGoToHome}
				>
					{t("404.button")}
				</Button>
			</VStack>
		</Center>
	);
}

export const getStaticProps: GetStaticProps = withLocale;
