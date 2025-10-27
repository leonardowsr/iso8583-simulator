"use client";
import { ProductsList } from "../products/products-list";
import { SidebarFilters } from "../products/sidebar-filters";

export function ProductsLayout() {
	return (
		<div>
			<div className="flex gap-4">
				<div className="flex h-full max-h-fit border-none">
					<SidebarFilters />
				</div>
				<div className="flex flex-1">
					<ProductsList />
				</div>
			</div>
		</div>
	);
}
