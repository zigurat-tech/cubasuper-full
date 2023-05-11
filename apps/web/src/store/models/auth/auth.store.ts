import { createModel } from "@rematch/core";
import { RootModel, useDispatchStore, useStore } from "store";
import { persist } from 'zustand/middleware';
import create from "zustand";

type AuthUser = {
	username: string;
	access: string;
	refresh: string;
	// id: string;
} | null

type AuthStoreState = {
	isModalOpen: boolean;
	isLogin: boolean;
	user: AuthUser;
};

const initialAuthStoreState: AuthStoreState = {
	isModalOpen: false,
	isLogin: false,
	user: null,
};

export const authStore = createModel<RootModel>()({
	state: initialAuthStoreState,
	reducers: {
		onLogin: (state, user:AuthUser) => ({
			...state,
			isLogin: true,
			user: user,
		}),
		onLogout: (state) => ({ ...state, isLogin: false, user: null }),
		onOpenModal: (state) => ({
			...state,
			isModalOpen: true,
		}),
		onCloseModal: (state) => ({ ...state, isModalOpen: false }),
	},
});

export const useAuth = () => {
	const { authStore: data } = useStore();
	const { authStore: actions } = useDispatchStore();

	return {
		...data,
		...actions,
	};
};

type UseAuthStoreState = AuthStoreState & {
	onLogin:(user:AuthUser)=>void;
	onLogout:()=>void;
	onOpenModal:()=>void;
	onCloseModal:()=>void;
}


export const useAuthStore = create<UseAuthStoreState>()(persist((set) => ({
	isLogin:false,
	isModalOpen:false,
	user:null,
	onLogin: (user)=>set((state)=>({user, isLogin:true})),
	onLogout: ()=>set((state)=>({user:null, isLogin:false})),
	onOpenModal: ()=>set((state)=>({isModalOpen:true})),
	onCloseModal: ()=>set((state)=>({isModalOpen:false}))
  }), {
	name: 'auth-storage',
  }))