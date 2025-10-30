"use client";
import type { Route } from "next";
import Link from "next/link";
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

const steps: { label: string; href: Route }[] = [
	{ label: "Carrinho", href: "/checkout/cart" },
	{ label: "Pagamento", href: "/checkout/payment" },
];

export function CheckoutHeader({ className }: { className?: string }) {
	const pathname = usePathname();
	const currentStep = steps.findIndex((s) => s.href === pathname);

	return (
		<div className="flex w-full border-b dark:bg-secondary">
			<Link href="/" className="p-4 font-bold text-2xl hover:text-primary">
				{" "}
				Página inicial
			</Link>
			<Breadcrumb
				className={cn(
					"flex flex-1 items-center justify-center py-4",
					className,
				)}
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
		</div>
	);
}
