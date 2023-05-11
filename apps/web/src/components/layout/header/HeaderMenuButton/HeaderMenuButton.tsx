import { UserMenu } from "../UserMenu";
import { HamburgerIcon, PhoneIcon, QuestionIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Drawer,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	HStack,
	Heading,
	IconButton,
	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";

export function HeaderMenuButton() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { t } = useTrans();
	const btnRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();

	return (
		<>
			<IconButton
				onClick={onOpen}
				ref={btnRef}
				aria-label={"collapse menu"}
				backgroundColor={"transparent"}
				borderColor={"transparent"}
				color={"white"}
				_focus={{
					opacity: 1,
					backgroundColor: "transparent",
				}}
				_hover={{
					opacity: 1,
					backgroundColor: "transparent",
				}}
			>
				<HamburgerIcon fontSize={"20px"} />
			</IconButton>
			<Drawer
				isOpen={isOpen}
				placement={"left"}
				onClose={onClose}
				finalFocusRef={btnRef}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />

					<DrawerHeader borderBottomWidth="1px">
						<VStack padding={"1rem"}>
							<Box
								onClick={async () => {
									await router.push("/", "/", {
										locale: router.locale,
									});
									onClose();
								}}
								position={"relative"}
								height={"32px"}
								width={"80px"}
								maxWidth={"200px"}
							>
								<Image fill src={"/cubasuper_logo.svg"} alt={"Logo header"} />
							</Box>
						</VStack>
					</DrawerHeader>
					<VStack
						width={"full"}
						padding={"1rem"}
						borderBottomWidth={"1px"}
						borderColor={"gray.200"}
						borderStyle={"solid"}
					>
						<UserMenu />
					</VStack>
					<VStack
						width={"full"}
						height={"full"}
						padding={"1rem"}
						spacing={"1rem"}
					>
						<VStack width={"full"} spacing={"1rem"}>
							<Button
								onClick={async () => {
									await router.push("/categories", "/categories", {
										locale: router.locale,
									});
									onClose();
								}}
								backgroundColor={"primary"}
								borderColor={"transparent"}
								color={"white"}
								width={"full"}
							>
								{t("header.category")}
							</Button>
							<Button
								onClick={async () => {
									await router.push("/my-products", "/my-products", {
										locale: router.locale,
									});
									onClose();
								}}
								backgroundColor={"primary"}
								borderColor={"transparent"}
								color={"white"}
								width={"full"}
							>
								{t("header.habitual")}
							</Button>
							<Button
								onClick={async () => {
									await router.push("/special-offers", "/special-offers", {
										locale: router.locale,
									});
									onClose();
								}}
								backgroundColor={"primary"}
								borderColor={"transparent"}
								color={"white"}
								width={"full"}
							>
								{t("header.special-offers")}
							</Button>
						</VStack>
					</VStack>
				</DrawerContent>
			</Drawer>
		</>
	);
}
