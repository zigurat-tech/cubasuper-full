import { ProductType } from "@api/server";
import { createModel } from "@rematch/core";
import { RootModel, useDispatchStore, useStore } from "store";

export type ProductDataArray = ProductType & {
	cant: number;
};

type CartDrawerStoreState = {
	isOpenCart: boolean;
	productDataArray: ProductDataArray[];
};

const cartDrawerStoreInitialState: CartDrawerStoreState = {
	isOpenCart: false,
	productDataArray: [],
};

export const cartDrawerStore = createModel<RootModel>()({
	state: cartDrawerStoreInitialState,
	reducers: {
		onOpenCart: (state) => ({ ...state, isOpenCart: true }),
		onCloseCart: (state) => ({ ...state, isOpenCart: false }),
		emptyCart: (state) => ({ ...state, productDataArray: [] }),
		addProductCartById: (state, id: number) => ({
			...state,
			productDataArray: state.productDataArray.map((pd) => {
				if (pd.id === id) {
					return { ...pd, cant: pd.cant + 1 };
				}
				return pd;
			}),
		}),
		addProductCart: (state, payload: ProductType) => {
			const product = state.productDataArray.find((pd) => pd.id === payload.id);

			if (product) {
				return {
					...state,
					productDataArray: state.productDataArray.map((pd) => {
						if (pd.id === product.id) {
							return { ...pd, cant: pd.cant + 1 };
						}
						return pd;
					}),
				};
			}

			return {
				...state,
				productDataArray: [...state.productDataArray, { ...payload, cant: 1 }],
			};
		},
		removeProductCartById: (state, id: number) => {
			const product = state.productDataArray.find((pd) => pd.id === id);

			if (product) {
				if (product.cant === 1) {
					return {
						...state,
						productDataArray: state.productDataArray.filter(
							(pd) => pd.id !== id,
						),
					};
				}
				return {
					...state,
					productDataArray: state.productDataArray.map((pd) => {
						if (pd.id === id) {
							return { ...pd, cant: pd.cant - 1 };
						}
						return pd;
					}),
				};
			}
		},
	},
});

export const useCart = () => {
	const { cartDrawerStore: data } = useStore();
	const { cartDrawerStore: actions } = useDispatchStore();
	const { openModal, closeModal, ...restActions } = actions;

	function getTotalCartPrice() {
		return data.productDataArray.reduce((prev, curr) => {
			return prev + (curr.price / 100) * curr.cant;
		}, 0);
	}
	function getTotalCartProducts() {
		return data.productDataArray.reduce((prev, curr) => {
			return prev + curr.cant;
		}, 0);
	}

	function getProductById(id: number) {
		return data.productDataArray.find((pd) => {
			return pd.id === id;
		});
	}

	return {
		...data,
		...restActions,
		getTotalCartPrice,
		getProductById,
		getTotalCartProducts,
	};
};
