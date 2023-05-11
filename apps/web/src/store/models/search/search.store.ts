import { createModel } from "@rematch/core";
import { RootModel, useDispatchStore, useStore } from "store";

type SearchStoreState = {
	query: string | null;
	beforeUrl: string | null;
	isLoading: boolean;
};

const searchStoreState: SearchStoreState = {
	query: null,
	beforeUrl: null,
	isLoading: false,
};

export const searchStore = createModel<RootModel>()({
	state: searchStoreState,
	reducers: {
		onChangeQuery: (state: SearchStoreState, payload: string) => ({
			...state,
			query: payload,
		}),
		onChangeBeforeUrl: (state: SearchStoreState, payload: string) => ({
			...state,
			beforeUrl: payload,
		}),
		onChangeLoading: (state: SearchStoreState, payload: boolean) => ({
			...state,
			isLoading: payload,
		}),
	},
});

export const useSearchStore = () => {
	const { searchStore: data } = useStore();
	const { searchStore: actions } = useDispatchStore();

	return { ...data, ...actions };
};
