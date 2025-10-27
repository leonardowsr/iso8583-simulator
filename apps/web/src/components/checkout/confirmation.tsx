"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCardStore } from "@/store/use-card-store";
import { useCartStore } from "@/store/use-cart-store";

function maskCardNumber(number: string) {
	return number.replace(/.(?=.{4})/g, "*");
}

export function Confirmation() {
	const card = useCardStore((s) => s.card);
	const cartItems = useCartStore((s) => s.cartItems);
	const finalValue = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);

	return (
		<>
			<div className="mb-0 w-full md:w-2xl">
				<Link
					href={"/checkout/payment"}
					className="text-muted-foreground text-sm hover:text-primary"
				>
					Voltar ao método de pagamento
				</Link>
			</div>
			<div className="mx-auto mt-8 w-full max-w-2xl rounded bg-white p-6 shadow">
				<h2 className="mb-4 font-bold text-xl">Confirmação do Pagamento</h2>
				<div className="mb-4">
					<div className="mb-2">
						<span className="font-medium">Nome no cartão: </span>
						{card?.name ? (
							card.name
						) : (
							<span className="text-muted-foreground italic">
								Não informado
							</span>
						)}
					</div>
					<div className="mb-2">
						<span className="font-medium">Número do cartão: </span>
						{card?.number ? (
							maskCardNumber(card.number)
						) : (
							<span className="text-muted-foreground italic">
								Não informado
							</span>
						)}
					</div>
					<div className="mb-2">
						<span className="font-medium">Validade: </span>
						{card?.expiry ? (
							card.expiry
						) : (
							<span className="text-muted-foreground italic">
								Não informado
							</span>
						)}
					</div>
					{/* Não exibe o CVC */}
				</div>
				<div className="mb-6">
					<span className="font-medium">Valor final: </span>
					<span className="font-bold text-green-600">
						R$ {finalValue.toFixed(2)}
					</span>
				</div>
				<div className="flex justify-center">
					<Button className="w-full md:w-1/2" size="lg">
						Confirmar Pagamento
					</Button>
				</div>
			</div>
		</>
	);
}
