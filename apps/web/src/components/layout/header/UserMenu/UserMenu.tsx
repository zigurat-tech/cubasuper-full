import { LogInView } from "./LogInView";
import { SignUpView } from "./SignUpView";
import { ChevronDownIcon, PhoneIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Center,
	Divider,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Text,
	VStack,
	useOutsideClick,
	useToast,
} from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import { useAuth, useAuthStore } from "@store/models";
import Image from "next/image";
import React, { useState } from "react";

export default function UserMenu() {
	const { user, isLogin, onLogout, isModalOpen, onOpenModal, onCloseModal } =
		useAuthStore();
	const [isLoginOpen, setIsLoginOpen] = useState<boolean>(true);
	const { t } = useTrans();
	const toast = useToast();

	const ref = React.useRef(null);

	const [isOpen, setIsOpen] = useState<boolean>(false);
	useOutsideClick({
		ref: ref,
		handler: () => setIsOpen(false),
	});

	function onIdentifyLogOut() {
		onLogout();
		onCloseModal();
		toast({
			title: t("share_description"),
			status: "success",
			variant: "left-accent",
			duration: 2000,
			render: () => (
				<Center
					backgroundColor={"primaryLight"}
					padding={"1rem"}
					borderRadius={"4px"}
				>
					<Text color={"white"}>{t("identify.log_out_success")}</Text>
				</Center>
			),
		});
	}

	return (
		<Menu placement={"bottom"} isOpen={isOpen}>
			<MenuButton
				width={{ base: "full", lg: "auto" }}
				as={Button}
				variant={{ base: "primary", lg: "unstyled" }}
				ref={ref}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<HStack spacing={"0.1rem"} justifyContent={"center"}>
					<Box height={"24px"} width={"24px"} position={"relative"}>
						<Image
							alt="user"
							src={"/icons/person_icon.svg"}
							height={24}
							width={24}
						/>
					</Box>
					<Text fontSize={"sm"} color={"white"}>
						{isLogin && user ? `${user.username}` : t("header.identify")}
					</Text>
					<ChevronDownIcon fontSize={"1.5rem"} color={"white"} />
				</HStack>
			</MenuButton>
			<MenuList width={"15rem"}>
				<VStack spacing={"0rem"}>
					<VStack
						width={"full"}
						padding={"1rem"}
						paddingBottom={"0.5rem"}
						spacing={"1rem"}
					>
						{isLogin ? (
							<Button
								width={"full"}
								borderRadius={"0.25rem"}
								onClick={onIdentifyLogOut}
							>
								{t("identify.log_out")}
							</Button>
						) : (
							<React.Fragment>
								<Button
									onClick={onOpenModal}
									width={"full"}
									borderRadius={"0.25rem"}
								>
									{t("header.log_in")}
								</Button>
								<Modal
									size={isLoginOpen ? "sm" : "md"}
									isOpen={isModalOpen}
									onClose={() => {
										onCloseModal();
										setTimeout(() => {
											setIsLoginOpen(true);
										}, 200);
									}}
									isCentered
								>
									<ModalOverlay />
									<ModalContent padding={"1rem 1rem 2rem"}>
										<ModalCloseButton />

										<ModalBody>
											{isLoginOpen ? (
												<LogInView
													onClickButton={() => setIsLoginOpen(false)}
												/>
											) : (
												<SignUpView
													onClickButton={() => setIsLoginOpen(true)}
												/>
											)}
										</ModalBody>
									</ModalContent>
								</Modal>
							</React.Fragment>
						)}
					</VStack>
				</VStack>
			</MenuList>
		</Menu>
	);
}
