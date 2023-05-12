import { Center, Text } from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import { useState } from "react";
import {env} from "../../../env";

export const Copyright = () => {
	const { t } = useTrans();
	const [year] = useState(new Date().getFullYear());

	return (
		<Center height={"4rem"} width={"full"} textAlign={"center"}>
			<Text maxWidth={{ base: "30ch", lg: "full" }}>
				Copyright © {year}. {env.NEXT_PUBLIC_URL}. {t("copyright")}
			</Text>
		</Center>
	);
};
