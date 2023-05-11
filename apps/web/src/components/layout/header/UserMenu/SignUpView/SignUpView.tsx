import { api } from "@api/server";
import {
	Button,
	Center,
	Divider,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	HStack,
	Heading,
	Input,
	Text,
	VStack,
	useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTrans } from "@hooks/useTrans";
import { useAuth } from "@store/models";
import { ReactComponent as CubaSuperLogo } from "public/cubasuper_logo.svg";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { z } from "zod";

type SignUpViewProps = {
	onClickButton: () => void;
};

const SignUpForm = z
	.object({
		username: z.string().min(1),
		first_name: z.string().min(1),
		last_name: z.string().min(1),
		password: z.string().min(1),
		confirm: z.string().min(1),
		email: z.string().email(),
	})
	.refine(({ confirm, password }) => confirm === password, {
		message: "Password need to be equal to Confirm",
		path: ["password&confirm"],
	});

type SignUpFormType = z.infer<typeof SignUpForm>;

export default function SignUpView({ onClickButton }: SignUpViewProps) {
	const { t, locale } = useTrans();
	const toast = useToast();
	const {
		register,
		watch,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<SignUpFormType>({
		reValidateMode: "onSubmit",
		resolver: zodResolver(SignUpForm),
	});
	const [isSucessSignUp, setIsSucessSignUp] = useState<boolean>(false);

	const { mutateAsync } = api.useMutation("post", "/backend/v1/user/");

	useFormPersist("register", {
		watch,
		setValue,
	});

	async function onSubmit(data: SignUpFormType) {
		const { confirm, ...rest } = data;
		try {
			await mutateAsync(rest);

			setIsSucessSignUp(true);
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
						<Text color={"white"}>{t("identify.sign_up_success")}</Text>
					</Center>
				),
			});
		} catch (error) {
			console.log(error);

			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
			const e = ((error as any)?.request?.responseText as string)?.includes(
				"Ya existe",
			);

			if (e) {
				toast({
					title: t("share_description"),
					status: "error",
					variant: "left-accent",
					duration: 2000,
					render: () => (
						<Center
							backgroundColor={"error.200"}
							padding={"1rem"}
							borderRadius={"4px"}
						>
							<Text color={"white"}>{t("identify.error_user_exist")}</Text>
						</Center>
					),
				});
			}
		}
	}

	return (
		<Center height={"full"} width={"full"}>
			{!isSucessSignUp ? (
				<VStack
					as={"form"}
					width={"full"}
					onSubmit={handleSubmit(onSubmit)}
					spacing={"1rem"}
				>
					<Heading>{t("identify.sign_up")}</Heading>
					<VStack width={"full"} spacing={"1rem"} paddingY={"1rem"}>
						<HStack spacing={"1rem"} width={"full"}>
							<FormControl isInvalid={!!errors["username"]}>
								<FormLabel>{t("identify.username")}</FormLabel>
								<Input
									placeholder={t("identify.username")}
									_focus={{
										borderColor: "initial !important",
									}}
									{...register("username")}
								/>
								{!errors["username"] ? (
									<FormHelperText>
										{t("identify.username_helper")}
									</FormHelperText>
								) : (
									<FormErrorMessage>
										{t("identify.username_error")}
									</FormErrorMessage>
								)}
							</FormControl>
							<FormControl isInvalid={!!errors["first_name"]}>
								<FormLabel>{t("identify.firstname")}</FormLabel>
								<Input
									{...register("first_name")}
									_focus={{
										borderColor: "initial !important",
									}}
									placeholder={t("identify.firstname")}
								/>
								{!errors["first_name"] ? (
									<FormHelperText>
										{t("identify.firstname_helper")}
									</FormHelperText>
								) : (
									<FormErrorMessage>
										{t("identify.firstname_error")}
									</FormErrorMessage>
								)}
							</FormControl>
						</HStack>
						<HStack spacing={"1rem"} width={"full"}>
							<FormControl isInvalid={!!errors["last_name"]}>
								<FormLabel>{t("identify.lastname")}</FormLabel>
								<Input
									{...register("last_name")}
									_focus={{
										borderColor: "initial !important",
									}}
									placeholder={t("identify.lastname")}
								/>
								{!errors["last_name"] ? (
									<FormHelperText>
										{t("identify.lastname_helper")}
									</FormHelperText>
								) : (
									<FormErrorMessage>
										{t("identify.lastname_error")}
									</FormErrorMessage>
								)}
							</FormControl>
							<FormControl isInvalid={!!errors["email"]}>
								<FormLabel>{t("identify.email")}</FormLabel>
								<Input
									{...register("email")}
									type="email"
									_focus={{
										borderColor: "initial !important",
									}}
									placeholder={t("identify.email")}
								/>
								{!errors["email"] ? (
									<FormHelperText>{t("identify.email_helper")}</FormHelperText>
								) : (
									<FormErrorMessage>
										{t("identify.email_error")}
									</FormErrorMessage>
								)}
							</FormControl>
						</HStack>
						<HStack spacing={"1rem"} width={"full"}>
							<FormControl
								isInvalid={
									!!errors["password"] ||
									!!(errors as Record<"password&confirm", Object>)[
										"password&confirm"
									]
								}
							>
								<FormLabel>{t("identify.password")}</FormLabel>
								<Input
									_focus={{
										borderColor: "initial !important",
									}}
									{...register("password")}
									type="password"
									placeholder={t("identify.password")}
								/>
								{!errors["password"] &&
									!!(errors as Record<"password&confirm", Object>)[
										"password&confirm"
									] && (
										<FormErrorMessage>
											{t("identify.password_confirm_error")}
										</FormErrorMessage>
									)}

								{!(
									errors["password"] ||
									(errors as Record<"password&confirm", Object>)[
										"password&confirm"
									]
								) && (
									<FormHelperText>
										{t("identify.password_helper")}
									</FormHelperText>
								)}

								{errors["password"] && (
									<FormErrorMessage>
										{t("identify.password_error")}
									</FormErrorMessage>
								)}
							</FormControl>
							<FormControl
								isInvalid={
									!!errors["confirm"] ||
									!!(errors as Record<"password&confirm", Object>)[
										"password&confirm"
									]
								}
							>
								<FormLabel>{t("identify.confirm")}</FormLabel>
								<Input
									{...register("confirm")}
									_focus={{
										borderColor: "initial !important",
									}}
									type="password"
									placeholder={t("identify.confirm")}
								/>
								{!errors["confirm"] &&
									!!(errors as Record<"password&confirm", Object>)[
										"password&confirm"
									] && (
										<FormErrorMessage>
											{t("identify.password_confirm_error")}
										</FormErrorMessage>
									)}

								{!(
									errors["confirm"] ||
									(errors as Record<"password&confirm", Object>)[
										"password&confirm"
									]
								) && (
									<FormHelperText>
										{t("identify.confirm_helper")}
									</FormHelperText>
								)}

								{errors["confirm"] && (
									<FormErrorMessage>
										{t("identify.confirm_error")}
									</FormErrorMessage>
								)}
							</FormControl>
						</HStack>
					</VStack>
					<Button width={"full"} type={"submit"} borderRadius={"0.5rem"}>
						{t("identify.sign_up")}
					</Button>
					<HStack height={"10px"} width={"full"}>
						<Divider backgroundColor={"neutral.100"} />
						<Text> {t("identify.divider_or")}</Text>
						<Divider backgroundColor={"neutral.100"} />
					</HStack>
					<Button
						variant={"secondary"}
						width={"full"}
						type={"submit"}
						borderRadius={"0.5rem"}
						onClick={onClickButton}
					>
						{t("identify.log_in")}
					</Button>
				</VStack>
			) : (
				<VStack height={"full"} paddingY={"2rem"}>
					<Center
						height={"full"}
						width={"15rem"}
						padding={"2rem"}
						backgroundColor={"primary"}
						borderTopLeftRadius={"5rem"}
						borderBottomRightRadius={"5rem"}
					>
						<CubaSuperLogo />
					</Center>
					<Heading>{locale==="es"?"Bienvenido a Cubasuper":"Welcome to Cubasuper"}</Heading>
					<Text width={"50ch"}>
						{locale==="es"?
						"Su cuenta ha sido creada con éxito, pero primero debe de ser verificada. Espere respuesta del equipo de Cubasuper."
						:"Your account has been created successfully, but it must first be verified. Wait for a response from the Cubasuper team."}
					</Text>
				</VStack>
			)}
		</Center>
	);
}
