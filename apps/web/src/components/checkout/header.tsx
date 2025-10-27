import React from "react";
import { cn } from "@/lib/utils";

interface CheckoutHeaderProps {
	step: number;
	className?: string;
}

const steps = [
	{ label: "Carrinho" },
	{ label: "Pagamento" },
	{ label: "Revisão" },
	{ label: "Confirmação" },
];

export function CheckoutHeader({ step, className }: CheckoutHeaderProps) {
	return (
		<nav
			className={cn("flex items-center justify-center gap-4 py-4", className)}
			aria-label="Etapas do checkout"
		>
			{steps.map((s, idx) => (
				<React.Fragment key={s.label}>
					<div className="flex flex-col items-center">
						<div
							className={cn(
								"flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold text-sm transition-all",
								idx < step
									? "border-green-500 bg-green-500 text-white"
									: idx === step
										? "border-primary bg-primary text-white"
										: "border-muted bg-muted text-muted-foreground",
							)}
						>
							{idx + 1}
						</div>
						<span
							className={cn(
								"mt-1 font-medium text-xs",
								idx === step ? "text-primary" : "text-muted-foreground",
							)}
						>
							{s.label}
						</span>
					</div>
					{idx < steps.length - 1 && (
						<div
							className={cn(
								"mx-2 h-1 w-8 rounded bg-muted transition-all",
								idx < step ? "bg-green-500" : "bg-muted",
							)}
						/>
					)}
				</React.Fragment>
			))}
		</nav>
	);
}
