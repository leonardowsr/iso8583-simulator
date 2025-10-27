"use client";

import { CircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { PRODUCTS_LIST } from "@/constants/products";
import { cn } from "@/lib/utils";

export function CommandMenu() {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const runCommand = React.useCallback((command: () => unknown) => {
		setOpen(false);
		command();
	}, []);

	const filteredProducts = React.useMemo(() => {
		if (!searchValue.trim()) return [];

		const searchTerm = searchValue.toLowerCase();
		return PRODUCTS_LIST.filter(
			(product) =>
				product.title.toLowerCase().includes(searchTerm) ||
				product.description.toLowerCase().includes(searchTerm) ||
				product.category.name.toLowerCase().includes(searchTerm),
		);
	}, [searchValue]);

	return (
		<>
			<Button
				variant="outline"
				className={cn(
					"relative w-full justify-start font-light text-muted-foreground text-sm sm:pr-12 md:w-40 lg:w-64",
				)}
				onClick={() => setOpen(true)}
			>
				<span className="inline-flex">Search...</span>
			</Button>
			<CommandDialog
				open={open}
				onOpenChange={(newOpen) => {
					setOpen(newOpen);
					if (!newOpen) {
						setSearchValue("");
					}
				}}
			>
				<CommandInput
					placeholder="Search products..."
					value={searchValue}
					onValueChange={setSearchValue}
				/>
				<CommandList>
					{filteredProducts.length === 0 && (
						<CommandEmpty>
							{searchValue.length > 0
								? "Nenhum produto encontrado."
								: "Digite para pesquisar..."}
						</CommandEmpty>
					)}

					{filteredProducts.length > 0 && (
						<CommandGroup heading="Products">
							{filteredProducts.map((product) => (
								<CommandItem
									key={product.id}
									value={product.title}
									onSelect={() => {
										runCommand(() => router.push(`/products/${product.slug}`));
									}}
									className="flex items-center gap-3 p-3"
								>
									<div className="flex-shrink-0">
										<img
											src={product.images[0]}
											alt={product.title}
											className="h-10 w-10 rounded-md object-cover"
											onError={(e) => {
												(e.target as HTMLImageElement).src = "/placeholder.png";
											}}
										/>
									</div>
									<div className="min-w-0 flex-1">
										<div className="truncate font-medium text-sm">
											{product.title}
										</div>
										<div className="truncate text-muted-foreground text-xs">
											{product.category.name} • R$ {product.price}
										</div>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					)}

					{searchValue.trim() && filteredProducts.length > 0 && (
						<>
							<CommandSeparator />
							<CommandGroup heading="Actions">
								<CommandItem
									onSelect={() => {
										runCommand(() =>
											router.push(
												`/products?search=${encodeURIComponent(searchValue)}`,
											),
										);
									}}
								>
									<div className="mr-2 flex h-4 items-center justify-center">
										<CircleIcon className="h-3" />
									</div>
									View all {filteredProducts.length} results
								</CommandItem>
							</CommandGroup>
						</>
					)}

					<CommandSeparator />
				</CommandList>
			</CommandDialog>
		</>
	);
}
