"use client";
import { type PreloadedQuery, usePreloadedQuery } from "react-relay";
import pageProductsQuery, {
	type pageProductsQuery as PageProductsQueryType,
} from "@/__generated_ecommerce__/pageProductsQuery.graphql";
import { CardHeader } from "../../ui/card";
import { ProductsList } from "../products/products-list";
import { SidebarFilters } from "../products/sidebar-filters";
import ContainerContent from "./container-content";

interface Props {
	queryRefs: { pageProductsQuery: PreloadedQuery<PageProductsQueryType> };
}

export function ProductsLayout({ queryRefs }: Props) {
	const data = usePreloadedQuery(
		pageProductsQuery,
		queryRefs.pageProductsQuery,
	);

	return (
		<ContainerContent
			CardHeader={
				<CardHeader>
					<h2 className="text-lg">Você está em: Produtos</h2>
				</CardHeader>
			}
		>
			<div>
				<div className="flex gap-4">
					<div className="flex h-full max-h-fit border-none">
						<SidebarFilters fragmentRef={data} />
					</div>
					<div className="flex flex-1">
						<ProductsList fragmentRef={data} />
					</div>
				</div>
			</div>
		</ContainerContent>
	);
}
