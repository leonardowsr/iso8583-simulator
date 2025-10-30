import { set } from "react-hook-form";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
	id: string;
	name: string;
	email: string;
}

interface UserState {
	user: User | null;
	setUser: (user: User) => void;
	rehydrated: boolean;
	setRehydrated: (rehydrated: boolean) => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set, _get) => ({
			rehydrated: false,
			setRehydrated(rehydrated) {
				set({ rehydrated });
			},
			user: null,
			setUser: (user) => {
				set({ user });
			},
		}),
		{
			name: "user",
			onRehydrateStorage: (state) => () => {
				if (state && typeof state.setRehydrated === "function") {
					state.setRehydrated(true);
				}
			},
		},
	),
);
