import { RootModel, models } from "./rootModels";
import { RematchDispatch, RematchRootState, init } from "@rematch/core";
import persistPlugin from "@rematch/persist";
import { useDispatch, useSelector } from "react-redux";
import { PersistConfig } from "redux-persist/es/types";
import storage from "redux-persist/lib/storage";

const persistConfig: PersistConfig<RootModel> = {
	key: "root",
	storage,
	blacklist: ["productModalStore"],
};

export const store = init<RootModel>({
	models,
	plugins: [persistPlugin(persistConfig)],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export const useStore = () => useSelector((state: RootState) => state);
export const useDispatchStore = () => useDispatch<Dispatch>();
