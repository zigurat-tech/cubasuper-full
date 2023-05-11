import { Center, Text } from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import { useState } from "react";

export const Copyright = () => {
	const { t } = useTrans();
	const [year] = useState(new Date().getFullYear());

	return (
		<Center height={"4rem"} width={"full"} textAlign={"center"}>
			<Text maxWidth={{ base: "30ch", lg: "full" }}>
				Copyright © {year}. {process.env.NEXT_PUBLIC_URL_NAME}. {t("copyright")}
			</Text>
		</Center>
	);
};
