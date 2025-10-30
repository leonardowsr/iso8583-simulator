"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/lib/store/use-cart-store";
import { useUserStore } from "@/lib/store/use-user-store";
import { LoginForm } from "../(ecommerce)/login-form";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const FRETE = {
	id: "pac",
	nome: "PAC - 10 a 11 dias úteis",
	preco: 0,
	destaque: "GRÁTIS",
};

export function CheckoutDisplayValue() {
	const user = useUserStore((state) => state.user);
	const isAuthenticated = !!user;
	const router = useRouter();
	const cartItems = useCartStore((state) => state.cartItems);
	const subtotal = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);

	const total = subtotal + FRETE.preco;
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	return (
		<>
			<div className={"w-full rounded-lg border p-4"}>
				<h3 className="mb-2 flex items-center gap-2 font-bold text-base">
					<span role="img" aria-label="cadeado">
						🔒
					</span>{" "}
					Resumo da compra
				</h3>

				<div className="mb-2 rounded border p-3">
					<div className="mb-1 font-semibold">Frete:</div>
					<RadioGroup defaultValue="default">
						<div className="flex items-center gap-3">
							<RadioGroupItem value="default" id="r1" defaultChecked={true} />
							<Label htmlFor="r1">PAC - 10 a 11 dias úteis</Label>
							<span className="ml-auto font-bold text-green-500">GRÁTIS</span>
						</div>
					</RadioGroup>
				</div>

				<div className="mb-2 text-sm text-zinc-300">
					<span className="font-medium">
						{cartItems.length} itens adicionados
					</span>
					<span className="float-right font-bold">
						R$ {subtotal.toFixed(2)}
					</span>
				</div>
				<div className="mb-2 flex justify-between text-sm">
					<span>Frete ({FRETE.nome.split(" - ")[0]})</span>
					<span
						className={FRETE.preco === 0 ? "font-semibold text-green-500" : ""}
					>
						{FRETE.preco === 0 ? "Grátis" : `R$ ${FRETE.preco.toFixed(2)}`}
					</span>
				</div>

				<div className="mb-2 flex items-center justify-between text-base">
					<span className="font-semibold">Valor Total a Pagar</span>
					<span className="font-bold text-green-400 text-lg">
						R$ {total.toFixed(2)}
					</span>
				</div>
			</div>
			<Button
				className="mt-3 w-full rounded bg-green-600 py-2 font-bold text-white transition hover:bg-green-700"
				onClick={() => {
					if (!isAuthenticated) {
						setIsLoginModalOpen(true);
						return;
					}
					router.push("/checkout/payment");
				}}
				size="lg"
				disabled={!cartItems.length}
				type="button"
			>
				Ir para pagamento
			</Button>
			<Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Login necessário</DialogTitle>
						<DialogDescription>
							Faça login para continuar com o pagamento
						</DialogDescription>
					</DialogHeader>
					<LoginForm />
				</DialogContent>
			</Dialog>
		</>
	);
}
