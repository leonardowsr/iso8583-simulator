import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
	id: string;
	slug: string;
	name: string;
	image: string;
	price: number;
	quantity: number;
}

interface CartState {
	rehydrated: boolean;
	setRehydrated: (rehydrated: boolean) => void;
	cartItems: CartItem[];
	cartItemsPayment: CartItem[];
	addItem: (item: CartItem) => void;
	updateQuantity: (id: string, quantity: number) => void;
	removeItem: (id: string) => void;
	setCartItemsPayment: () => void;
	clearCart: () => void;
}

export const useCartStore = create<CartState>()(
	persist(
		(set) => ({
			rehydrated: false,
			setRehydrated(rehydrated) {
				set({ rehydrated });
			},
			cartItems: [],
			cartItemsPayment: [],
			addItem: (item) => {
				set((state) => {
					const existing = state.cartItems.find((i) => i.id === item.id);
					if (existing) {
						return {
							cartItems: state.cartItems.map((i) =>
								i.id === item.id
									? { ...i, quantity: i.quantity + item.quantity }
									: i,
							),
						};
					}
					return { cartItems: [...state.cartItems, item] };
				});
			},
			updateQuantity: (id, quantity) => {
				set((state) => ({
					cartItems: state.cartItems.map((item) =>
						item.id === id
							? { ...item, quantity: Math.max(1, quantity) }
							: item,
					),
				}));
			},
			removeItem: (id) => {
				set((state) => ({
					cartItems: state.cartItems.filter((item) => item.id !== id),
				}));
			},
			setCartItemsPayment: () => {
				set((state) => ({
					cartItemsPayment: [...state.cartItems],
				}));
			},
			clearCart: () => set({ cartItems: [] }),
		}),
		{
			name: "cart_items",
			onRehydrateStorage: (state) => () => {
				if (state && typeof state.setRehydrated === "function") {
					state.setRehydrated(true);
				}
			},
		},
	),
);
