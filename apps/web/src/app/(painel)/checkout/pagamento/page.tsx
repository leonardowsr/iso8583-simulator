"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/store/use-cart-store";

const PAGAMENTOS = [
	{ id: "pix", nome: "Pix" },
	{ id: "cartao", nome: "Cartão de Crédito" },
	{ id: "boleto", nome: "Boleto Bancário" },
];

type StatusPagamento =
	| "inicial"
	| "processando"
	| "pago"
	| "falhado"
	| "expirado";

export default function PagamentoPage() {
	const cartItems = useCartStore((state) => state.cartItems);
	const subtotal = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);
	const [pagamento, setPagamento] = useState(PAGAMENTOS[0]);
	const [status, setStatus] = useState<StatusPagamento>("inicial");
	const router = useRouter();

	function handlePagar() {
		setStatus("processando");
		setTimeout(() => {
			const r = Math.random();
			if (r < 0.7) setStatus("pago");
			else if (r < 0.85) setStatus("falhado");
			else setStatus("expirado");
		}, 2000);
	}

	return (
		<div className="mx-auto mt-8 max-w-md rounded-lg border p-6 shadow-lg">
			<h2 className="mb-4 font-bold text-xl">Pagamento</h2>
			<div className="mb-2 font-semibold">Escolha a forma de pagamento:</div>
			<div className="mb-4 flex gap-2">
				{PAGAMENTOS.map((p) => (
					<button
						key={p.id}
						className={
							"rounded border px-3 py-1" +
							(pagamento.id === p.id
								? "border-green-600 bg-green-600 text-white"
								: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700")
						}
						onClick={() => {
							setPagamento(p);
							setStatus("inicial");
						}}
						disabled={status === "processando"}
					>
						{p.nome}
					</button>
				))}
			</div>

			{pagamento.id === "pix" && (
				<div className="mb-2">
					<div className="font-bold text-green-400">
						Pagamento instantâneo via Pix
					</div>
					<div className="text-xs text-zinc-400">
						(simulação: clique em "Pagar" para testar)
					</div>
				</div>
			)}
			{pagamento.id === "cartao" && (
				<div className="mb-2">
					<input
						className="mb-1 w-full rounded border px-2 py-1 text-zinc-100"
						placeholder="Número do cartão"
						disabled={status === "processando"}
					/>
					<input
						className="mb-1 w-full rounded border px-2 py-1 text-zinc-100"
						placeholder="Nome impresso"
						disabled={status === "processando"}
					/>
					<div className="flex gap-2">
						<input
							className="flex-1 rounded border px-2 py-1 text-zinc-100"
							placeholder="Validade"
							disabled={status === "processando"}
						/>
						<input
							className="flex-1 rounded border px-2 py-1 text-zinc-100"
							placeholder="CVV"
							disabled={status === "processando"}
						/>
					</div>
				</div>
			)}
			{pagamento.id === "boleto" && (
				<div className="mb-2 text-zinc-300">
					<div>Boleto gerado na finalização. Pague até o vencimento.</div>
				</div>
			)}

			<div className="mt-4 mb-2 flex items-center justify-between text-base">
				<span className="font-semibold">Total:</span>
				<span className="font-bold text-green-400 text-lg">
					R$ {subtotal.toFixed(2)}
				</span>
			</div>

			<button
				className="mt-2 w-full rounded bg-green-600 py-2 font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
				onClick={handlePagar}
				type="button"
				disabled={status === "processando" || status === "pago"}
			>
				{status === "processando"
					? "Processando..."
					: status === "pago"
						? "Pago!"
						: "Pagar"}
			</button>

			{status !== "inicial" && (
				<div className="mt-2 text-center">
					{status === "pago" && (
						<span className="font-bold text-green-400">
							Pagamento aprovado! 🎉
						</span>
					)}
					{status === "falhado" && (
						<span className="font-bold text-red-400">
							Falha no pagamento. Tente novamente.
						</span>
					)}
					{status === "expirado" && (
						<span className="font-bold text-yellow-400">
							Pagamento expirado. Escolha novamente.
						</span>
					)}
				</div>
			)}

			<button
				className="mt-4 w-full text-sm text-zinc-400 underline hover:text-zinc-200"
				onClick={() => router.push("/checkout")}
				disabled={status === "processando"}
				type="button"
			>
				Voltar ao resumo
			</button>
		</div>
	);
}
