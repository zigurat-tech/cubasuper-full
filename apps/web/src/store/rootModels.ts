import { Models } from "@rematch/core";
import { cartDrawerStore } from "@store/models/cartDrawer";
import { productModalStore } from "@store/models/productModal";
import { searchStore } from "@store/models/search";
import { authStore } from "store/models/auth";

export interface RootModel extends Models<RootModel> {
	authStore: typeof authStore;
	productModalStore: typeof productModalStore;
	cartDrawerStore: typeof cartDrawerStore;
	searchStore: typeof searchStore;
}
export const models: RootModel = {
	authStore,
	productModalStore,
	cartDrawerStore,
	searchStore,
};
