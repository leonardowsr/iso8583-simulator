"use client";

import Link from "next/link";
import { forwardRef } from "react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { CONFIG } from "@/lib/constant";
import { cn } from "@/lib/utils";

export function MainNav() {
	return (
		<div className="hidden gap-4 md:flex">
			<Link href="/" className="flex items-center">
				<span className="hidden font-medium sm:inline-block">
					{CONFIG.name}
				</span>
			</Link>
			<NavMenu />
		</div>
	);
}

export function NavMenu() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<Link href="/products" legacyBehavior passHref>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							<div className="font-normal text-foreground/70">Produtos</div>
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>
						<div className="font-normal text-foreground/70">Categorias</div>
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
							<li className="row-span-3">
								<NavigationMenuLink asChild>
									<Link
										className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
										href={"/products?categories=roupas"}
									>
										<div className="mt-4 mb-2 font-medium text-lg">Roupas</div>
										<p className="text-muted-foreground text-sm leading-tight">
											Roupas estilosas e confortáveis para todas as ocasiões.
										</p>
									</Link>
								</NavigationMenuLink>
							</li>
							<ListItem
								href="/products?categories=eletronicos"
								title="Eletrônicos"
							>
								Eletrônicos de alta qualidade para o seu dia a dia.
							</ListItem>
							<ListItem href="/products?categories=calcados" title="Calçados">
								Calçados confortáveis e estilosos para todas as ocasiões.
							</ListItem>
							<ListItem href="/products?categories=moveis" title="Móveis">
								Móveis elegantes e funcionais para sua casa.
							</ListItem>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					href={href}
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="font-medium text-sm leading-none">{title}</div>
					<p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
});

ListItem.displayName = "ListItem";
