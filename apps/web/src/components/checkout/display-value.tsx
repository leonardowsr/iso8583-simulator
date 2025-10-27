"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/use-cart-store";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const FRETE = {
	id: "pac",
	nome: "PAC - 10 a 11 dias úteis",
	preco: 0,
	destaque: "GRÁTIS",
};

export function CheckoutDisplayValue() {
	const cartItems = useCartStore((state) => state.cartItems);
	const subtotal = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);

	const router = useRouter();
	const total = subtotal + FRETE.preco;

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
			<button
				className="mt-3 w-full rounded bg-green-600 py-2 font-bold text-white transition hover:bg-green-700"
				onClick={() => router.push("/checkout/payment")}
				type="button"
			>
				Ir para pagamento
			</button>
		</>
	);
}
