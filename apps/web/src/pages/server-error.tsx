import { Center, Text } from "@chakra-ui/react";
import { withLocale } from "@utils/props/withLocale";
import { GetStaticProps } from "next";
import React from "react";

//TODO:Make this page

export default function Page() {
	return (
		<Center
			height={"full"}
			// paddingTop={{ base: '8rem', md: '4.5rem' }}
			minHeight={"100vh"}
		>
			<Text fontSize={"4rem"} fontWeight={600} color={"error.200"}>
				Server Error
			</Text>
		</Center>
	);
}

export const getStaticProps: GetStaticProps = withLocale;
