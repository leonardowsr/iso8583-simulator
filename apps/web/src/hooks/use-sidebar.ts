import type { StateCreator } from "zustand";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SidebarSettings = { disabled: boolean; isHoverOpen: boolean };
type SidebarStore = {
	isOpen: boolean;
	settings: SidebarSettings;
	toggleOpen: () => void;
	setIsOpen: (isOpen: boolean) => void;
	getOpenState: () => boolean;
	setSettings: (settings: Partial<SidebarSettings>) => void;
};

const sidebarStore: StateCreator<SidebarStore> = (set, get) => ({
	isOpen: true,
	settings: { disabled: false, isHoverOpen: false },
	toggleOpen: () => {
		set((state: SidebarStore) => ({ ...state, isOpen: !state.isOpen }));
	},
	setIsOpen: (isOpen: boolean) => {
		set({ isOpen });
	},
	getOpenState: () => {
		const state: SidebarStore = get();
		return state.isOpen || state.settings.isHoverOpen;
	},
	setSettings: (settings: Partial<SidebarSettings>) => {
		set((state: SidebarStore) => ({
			...state,
			settings: { ...state.settings, ...settings },
		}));
	},
});

export const useSidebar = create<SidebarStore>()(
	persist(sidebarStore, {
		name: "sidebar",
		storage: createJSONStorage(() => localStorage),
	}) as unknown as StateCreator<SidebarStore>,
);
