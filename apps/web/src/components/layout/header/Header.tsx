import { HeaderMenuButton } from "./HeaderMenuButton";
import { SearchProductInput } from "./SearchProductInput";
import { ShippingCartButton } from "./ShippingCartButton";
import { UserMenu } from "./UserMenu";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Center,
	Container,
	Flex,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Stack,
	Text,
	VStack,
	useMediaQuery,
} from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import { FramerBox } from "@utils/framer";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export function Header() {
	const router = useRouter();
	const { t, locale, switchLocaleEn, switchLocaleEs } = useTrans();

	const [isLargerThanLG] = useMediaQuery("(min-width: 992px)", {
		ssr: true,
		fallback: true,
	});

	return (
		<Container
			as={"header"}
			height={{ base: "8rem", lg: "4.5rem" }}
			maxWidth={"none"}
			backgroundColor={"primary"}
			paddingY={"1rem"}
			paddingX={{ base: "1rem", lg: "1.5rem" }}
			position={"sticky"}
			zIndex={99}
			boxShadow={"xl"}
			top={0}
		>
			<Stack
				height={"full"}
				alignItems={"center"}
				direction={{
					base: "column",
					lg: "row",
				}}
			>
				<HStack
					width={"full"}
					justifyContent={isLargerThanLG ? "start" : "space-between"}
					spacing={{ base: "1rem", lg: "1rem" }}
				>
					{!isLargerThanLG && <HeaderMenuButton />}

					{isLargerThanLG ? (
						<HStack width={"full"} spacing={"2rem"}>
							<Box
								as={Link}
								href={"/"}
								display={{ base: "none", sm: "initial" }}
								position={"relative"}
								height={"64px"}
								width={"80px"}
								maxWidth={"200px"}
							>
								<Image
									fill
									src={"/cubasuper_logo.svg"}
									alt={"Logo header"}
									priority
								/>
							</Box>
							<SearchProductInput />
							<LinkUnderline
								href={"/categories"}
								isVisible={router.asPath.includes("categories")}
								text={t("header.category")}
							/>
							<LinkUnderline
								href={"/about-us"}
								isVisible={router.asPath === "/about-us"}
								text={t("header.about-us")}
							/>
							<LinkUnderline
								href={"/contacts"}
								isVisible={router.asPath === "/contacts"}
								text={t("header.contacts")}
							/>
						</HStack>
					) : (
						<Flex justifyContent={"end"} width={"full"}>
							<Center width={"full"}>
								<Box
									as={Link}
									href={"/"}
									position={"relative"}
									height={"32px"}
									width={"80px"}
									maxWidth={"200px"}
								>
									<Image fill src={"/cubasuper_logo.svg"} alt={"Logo header"} />
								</Box>
							</Center>
							<ShippingCartButton />
						</Flex>
					)}
				</HStack>
				<HStack
					height={"full"}
					width={isLargerThanLG ? "initial" : "full"}
					spacing={"0.5rem"}
				>
					{isLargerThanLG ? (
						<>
							<UserMenu />
							<Menu placement={"bottom-end"}>
								<MenuButton as={Button} variant={"unstyled"}>
									<HStack spacing={"0.1rem"}>
										<Image
											src={`/header/${locale}_icon.svg`}
											alt={"current language"}
											height={16}
											width={24}
										/>
										<ChevronDownIcon fontSize={"1.5rem"} color={"white"} />
									</HStack>
								</MenuButton>
								<MenuList minWidth={"0px"}>
									<MenuItem
										height={"3rem"}
										paddingX={"1rem"}
										onClick={switchLocaleEn}
									>
										<HStack>
											<Image
												src={"/header/en_icon.svg"}
												alt={"current language"}
												height={16}
												width={24}
											/>
											<Text>{t("header.english")}</Text>
										</HStack>
									</MenuItem>
									<MenuItem
										height={"3rem"}
										paddingX={"1rem"}
										onClick={switchLocaleEs}
									>
										<HStack>
											<Image
												src={"/header/es_icon.svg"}
												alt={"current language"}
												height={16}
												width={24}
											/>
											<Text>{t("header.spanish")}</Text>
										</HStack>
									</MenuItem>
								</MenuList>
							</Menu>
							<ShippingCartButton />
						</>
					) : (
						<SearchProductInput />
					)}
				</HStack>
			</Stack>
		</Container>
	);
}

type LinkUnderlineProps = {
	href: string;
	isVisible: boolean;
	text: string;
};

export function LinkUnderline({ isVisible, href, text }: LinkUnderlineProps) {
	const router = useRouter();
	const [isHover, setIsHover] = useState<boolean>(false);

	return (
		<Box
			as={Link}
			href={`${router.locale === "en" ? "/en" : ""}${href}`}
			_hover={{ opacity: 1 }}
		>
			<VStack
				spacing={"0.1rem"}
				height={"1.75rem"}
				justifyContent={"center"}
				opacity={isVisible || isHover ? 1 : 0.8}
				onMouseEnter={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
				margin={"0.3rem"}
				position={"relative"}
			>
				<Text
					fontSize={"sm"}
					fontWeight={600}
					color={"white"}
					whiteSpace={"nowrap"}
				>
					{text}
				</Text>
				<AnimatePresence>
					{isVisible && (
						<FramerBox
							key={"box"}
							width={"full"}
							backgroundColor={"selectedYellow"}
							height={"0.25rem"}
							top={"1.5rem"}
							position={"absolute"}
							borderRadius={"1rem"}
							initial={{ width: "0px", opacity: 0 }}
							animate={{ width: "100%", opacity: 1 }}
							exit={{ width: "0px", opacity: 0 }}
							// @ts-ignore
							transition={{
								duration: 0.2,
							}}
						/>
					)}
					{isHover && !isVisible && (
						<FramerBox
							key={"box"}
							width={"full"}
							top={"1.5rem"}
							backgroundColor={"selected"}
							height={"0.25rem"}
							position={"absolute"}
							borderRadius={"1rem"}
							initial={{ width: "0px", opacity: 0 }}
							animate={{ width: "100%", opacity: 1 }}
							exit={{ width: "0px", opacity: 0 }}
							// @ts-ignore
							transition={{
								duration: 0.2,
							}}
						/>
					)}
				</AnimatePresence>
			</VStack>
		</Box>
	);
}
