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
}

export const useUserStore = create<UserState>()(
	persist(
		(set, _get) => ({
			user: null,
			setUser: (user) => {
				set({ user });
			},
		}),
		{
			name: "user",
		},
	),
);
