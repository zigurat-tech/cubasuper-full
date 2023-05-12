import { CheckoutPostType, apiClient } from "@api/server";
import {
	Button,
	HStack,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	Text,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { useTrans } from "@hooks/useTrans";
import { useAuth, useAuthStore } from "@store/index";
import { useCart } from "@store/models/cartDrawer";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SANDBOX_URLS, createRedsysAPI } from "redsys-easy";
import {env} from "../../../../env";

export function CartDrawerCheckoutModal() {
	const router = useRouter();
	const { onCloseCart, getTotalCartPrice, emptyCart, productDataArray } =
		useCart();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { t } = useTrans();
	const { user } = useAuthStore();

	async function onSubmit() {
		if (user) {
			const amount = (getTotalCartPrice() * 100).toString();
			const secret = `${env.NEXT_PUBLIC_REDSYS_SECRET}`;
			const merchantCode = `${env.NEXT_PUBLIC_REDSYS_MERCHANTCODE}`;
			const order = Math.floor(
				Math.random() * (10 ** 10 - 10 ** 3) + 10 ** 3,
			).toString();

			const { createRedirectForm } = createRedsysAPI({
				secretKey: secret,
				urls: SANDBOX_URLS,
			});

			const checkoutSuccessParams: CheckoutPostType = {
				total: (getTotalCartPrice() * 100).toString(),
				user: user?.username,
				date_of_creation: dayjs().format("YYYY-MM-DD HH:mm:ss"),
				component: productDataArray.map((pd) => ({
					quantity: pd.cant,
					actual_amount: pd.price,
					product: pd.id,
				})),
			};

			const encodeParams = encodeURIComponent(
				JSON.stringify(checkoutSuccessParams),
			);

			const okURL = `${env.NEXT_PUBLIC_URL}/checkout/success?data=${encodeParams}`;

			const redirectForm = createRedirectForm({
				DS_MERCHANT_AMOUNT: amount,
				DS_MERCHANT_CURRENCY: "978",
				DS_MERCHANT_MERCHANTCODE: merchantCode,
				DS_MERCHANT_MERCHANTURL: `${env.NEXT_PUBLIC_URL}`,
				DS_MERCHANT_ORDER: order,
				DS_MERCHANT_TERMINAL: "1",
				DS_MERCHANT_TRANSACTIONTYPE: "0",
				DS_MERCHANT_URLKO: `${env.NEXT_PUBLIC_URL}/checkout/failure`,
				DS_MERCHANT_URLOK: okURL,
			});

			const form = document.createElement("form");

			form.innerHTML = `<form
                name="from"
                action="https://sis-t.redsys.es:25443/sis/realizarPago"
                method="POST"
            >
                <input
                    type="hidden"
                    name="Ds_SignatureVersion"
                    value="${redirectForm.body.Ds_SignatureVersion}"
                />
                <input
                    type="hidden"
                    name="Ds_MerchantParameters"
                    value="${redirectForm.body.Ds_MerchantParameters}"
                />
                <input
                    type="hidden"
                    name="Ds_Signature"
                    value="${redirectForm.body.Ds_Signature}"
                />
            </form>`;
			form.method = "POST";
			form.name = "from";
			form.action = redirectForm.url;

			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);

			onCloseCart();
			emptyCart();
		}
	}

	return (
		<>
			<Button
				borderRadius={"0.5rem"}
				variant={"secondary"}
				width={"full"}
				onClick={onOpen}
			>
				{t("cart.checkout")}
			</Button>
			<Modal size={"sm"} isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent padding={"3rem 1rem 1rem"}>
					<ModalCloseButton />
					<ModalBody>
						<VStack>
							<Heading fontSize={"2xl"}>{t("cart.checkout")}</Heading>
							<Text> {t("cart.checkout_confirm")}</Text>
						</VStack>
					</ModalBody>

					<ModalFooter>
						<HStack width={"full"}>
							<Button
								borderRadius={"0.25rem"}
								variant={"primarySolid"}
								onClick={onClose}
								width={"full"}
							>
								{t("cart.empty_cancel")}
							</Button>
							<Button
								width={"full"}
								borderRadius={"0.25rem"}
								variant={"error"}
								onClick={onSubmit}
							>
								{t("cart.checkout_accept")}
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
