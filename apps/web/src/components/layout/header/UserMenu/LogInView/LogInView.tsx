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
import { useAuth, useAuthStore } from "@store/models";
import React from "react";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { z } from "zod";

type LogInViewProps = {
	onClickButton: () => void;
};

const LoginForm = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});

type LoginFormType = z.infer<typeof LoginForm>;

export default function LogInView({ onClickButton }: LogInViewProps) {
	const { onLogin, user } = useAuthStore();
	const toast = useToast();
	
	const { t } = useTrans();
	const {
		register,
		watch,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<LoginFormType>({
		resolver: zodResolver(LoginForm),
	});

	const { mutateAsync } = api.useMutation("post", "/backend/v1/token/");

	useFormPersist("login", {
		watch,
		setValue,
	});



	async function onSubmit(data: LoginFormType) {
		try {
			const res = await mutateAsync(data);

			onLogin({username:data.username, ...res});
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
						<Text color={"white"}>{t("identify.log_in_success")}</Text>
					</Center>
				),
			});
		} catch (error) {
			// rome-ignore lint/suspicious/noExplicitAny: <explanation>
			const e = ((error as any)?.request?.responseText as string)?.includes(
				"La combinación de credenciales no tiene una cuenta activa",
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
							<Text color={"white"}>{t("identify.error_user_inactive")}</Text>
						</Center>
					),
				});
			}
		}
	}

	return (
		<Center height={"full"} width={"full"}>
			<VStack
				as={"form"}
				width={"full"}
				onSubmit={handleSubmit(onSubmit)}
				spacing={"1rem"}
			>
				<Heading textAlign={"center"}>{t("identify.title")}</Heading>
				<VStack width={"full"} spacing={"1rem"} paddingY={"1rem"}>
					<FormControl isInvalid={!!errors["username"]}>
						<FormLabel>{t("identify.username")}</FormLabel>
						<Input
							placeholder={t("identify.username")}
							variant={"outline"}
							{...register("username", {
								required: true,
							})}
							_focus={{
								borderColor: "initial !important",
							}}
						/>
						{!errors["username"] ? (
							<FormHelperText>{t("identify.username_helper")}</FormHelperText>
						) : (
							<FormErrorMessage>
								{t("identify.username_error")}
							</FormErrorMessage>
						)}
					</FormControl>
					<FormControl isInvalid={!!errors["password"]}>
						<FormLabel>{t("identify.password")}</FormLabel>
						<Input
							placeholder={t("identify.password")}
							variant={"outline"}
							type="password"
							{...register("password", {
								required: true,
							})}
							_focus={{
								borderColor: "initial !important",
							}}
						/>
						{!errors["password"] ? (
							<FormHelperText>{t("identify.password_helper")}</FormHelperText>
						) : (
							<FormErrorMessage>
								{t("identify.password_error")}
							</FormErrorMessage>
						)}
					</FormControl>
				</VStack>
				<Button width={"full"} type={"submit"} borderRadius={"0.5rem"}>
					{t("identify.log_in")}
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
					{t("identify.sign_up")}
				</Button>
			</VStack>
		</Center>
	);
}
