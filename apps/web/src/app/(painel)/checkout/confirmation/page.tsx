"use client";
import { Confirmation } from "@/components/checkout/confirmation";

export default function Page() {
	return (
		<div className="flex flex-col items-center gap-6 py-10">
			<Confirmation />
		</div>
	);
}
