"use client";

import CardPaymentMethod from "@/components/checkout/payment-method";

export default function PagamentoPage() {
	return (
		<div className="flex flex-col items-center gap-6 py-10">
			<CardPaymentMethod />
		</div>
	);
}
