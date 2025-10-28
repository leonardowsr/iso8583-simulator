"use client";

import { Minus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import { Button } from "../ui/button";

export function CheckoutProductList({ className }: { className?: string }) {
	const cartItems = useCartStore((state) => state.cartItems);
	const updateQuantity = useCartStore((state) => state.updateQuantity);
	const removeItem = useCartStore((state) => state.removeItem);
	const router = useRouter();

	if (cartItems.length === 0) {
		return (
			<div
				className={cn(
					"flex flex-col items-center justify-center py-12",
					className,
				)}
			>
				<span className="text-muted-foreground">
					Nenhum produto no carrinho.
				</span>
			</div>
		);
	}

	return (
		<>
			<p>Lista de produtos no carrinho:</p>
			<div className={cn("w-full space-y-4", className)}>
				{cartItems.map((item) => (
					<div
						key={item.id}
						className="group relative flex rounded-lg border bg-card p-2 shadow-sm transition-colors hover:bg-accent/50"
					>
						<div className="relative h-20 w-20 overflow-hidden rounded">
							<img
								alt={item.name}
								src={item.image}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="ml-4 flex flex-1 flex-col justify-between">
							<div>
								<div className="flex items-start justify-between">
									<span className="line-clamp-2 font-medium text-sm group-hover:text-primary">
										{item.name}
									</span>
									<button
										className="-mt-1 -mr-1 ml-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
										onClick={() => removeItem(item.id)}
										type="button"
									>
										<X className="h-4 w-4" />
										<span className="sr-only">Remover item</span>
									</button>
								</div>
							</div>
							<div className="mt-2 flex items-center justify-between">
								<div className="flex items-center rounded-md border">
									<button
										className="flex h-7 w-7 items-center justify-center rounded-l-md border-r text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
										disabled={item.quantity <= 1}
										onClick={() => updateQuantity(item.id, item.quantity - 1)}
										type="button"
									>
										<Minus className="h-3 w-3" />
										<span className="sr-only">Diminuir quantidade</span>
									</button>
									<span className="flex h-7 w-7 items-center justify-center font-medium text-xs">
										{item.quantity}
									</span>
									<button
										className="flex h-7 w-7 items-center justify-center rounded-r-md border-l text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
										onClick={() => updateQuantity(item.id, item.quantity + 1)}
										type="button"
									>
										<Plus className="h-3 w-3" />
										<span className="sr-only">Aumentar quantidade</span>
									</button>
								</div>
								<div className="font-medium text-sm">
									R$ {(item.price * item.quantity).toFixed(2)}
								</div>
							</div>
						</div>
					</div>
				))}
				<Button
					variant="outline"
					size="lg"
					onClick={() => router.push("/products")}
				>
					Voltar às compras
				</Button>
			</div>
		</>
	);
}
