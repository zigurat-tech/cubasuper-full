import { ProductType } from "@api/server";
import { useTrans } from "@hooks/useTrans";
import { createModel } from "@rematch/core";
import { useRouter } from "next/router";
import { RootModel, useDispatchStore, useStore } from "store";

type ProductModalStoreState = {
	isOpen: boolean;
	fallbackUrl: string;
	product: ProductType | null;
};

const productModalStoreState: ProductModalStoreState = {
	isOpen: false,
	fallbackUrl: "/",
	product: null,
};

export const productModalStore = createModel<RootModel>()({
	state: productModalStoreState,
	reducers: {
		openModal: (
			state,
			payload: Omit<ProductModalStoreState, "isOpen" | "fallbackUrl"> & {
				fallbackUrl: string;
			},
		) => ({
			...state,
			...payload,
			isOpen: true,
		}),
		closeModal: (state, locale: "en" | "es") => {
			window.history.pushState(
				{},
				"",
				`${locale === "en" ? "/en" : ""}${state.fallbackUrl}`,
			);
			return { ...state, isOpen: false };
		},
	},
});

export const useProductModal = () => {
	const router = useRouter();
	const { locale } = useTrans();
	const { productModalStore: data } = useStore();
	const { productModalStore: actions } = useDispatchStore();
	const { openModal, closeModal, ...restActions } = actions;

	async function onOpenModal(
		payload: Omit<ProductModalStoreState, "isOpen" | "fallbackUrl"> & {
			productHref: string;
		},
	) {
		openModal({
			product: payload.product,
			fallbackUrl: router.asPath,
		});

		window.history.pushState(
			{},
			"",
			`${locale === "en" ? "/en" : ""}${payload.productHref}`,
		);
	}

	async function onCloseModal() {
		await closeModal(locale);
	}

	return {
		...data,
		...restActions,
		openModal: onOpenModal,
		closeModal: onCloseModal,
	};
};
