import { create } from "zustand";

export interface CardData {
	name: string;
	number: string;
	expiry: string;
	cvc: string;
}

interface CardStore {
	card: CardData | null;
	setCard: (card: CardData) => void;
	clearCard: () => void;
}

export const useCardStore = create<CardStore>((set) => ({
	card: null,
	setCard: (card) => set({ card }),
	clearCard: () => set({ card: null }),
}));
