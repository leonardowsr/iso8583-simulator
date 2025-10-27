"use client";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface CheckoutHeaderProps {
	step: number;
	className?: string;
}

const steps: { label: string; href: Route }[] = [
	{ label: "Carrinho", href: "/checkout/cart" },
	{ label: "Pagamento", href: "/checkout/payment" },
	{ label: "Confirmação", href: "/checkout/confirmation" },
];

export function CheckoutHeader({ className }: { className?: string }) {
	const pathname = usePathname();
	const currentStep = steps.findIndex((s) => s.href === pathname);

	return (
		<Breadcrumb
			className={cn("flex items-center justify-center py-4", className)}
		>
			<BreadcrumbList>
				{steps.map((s, idx) => (
					<React.Fragment key={s.label}>
						<BreadcrumbItem>
							{idx < currentStep ? (
								<BreadcrumbLink
									asChild
									className="pointer-events-none cursor-default font-bold text-green-600"
								>
									<span>{s.label}</span>
								</BreadcrumbLink>
							) : idx === currentStep ? (
								<BreadcrumbPage className="pointer-events-none cursor-default font-bold text-primary">
									{s.label}
								</BreadcrumbPage>
							) : (
								<BreadcrumbLink
									asChild
									className="pointer-events-none cursor-default text-muted-foreground"
								>
									<span>{s.label}</span>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
						{idx < steps.length - 1 && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
