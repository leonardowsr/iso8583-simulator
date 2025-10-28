"use client";
import { useEffect } from "react";
import { set } from "react-hook-form";
import { graphql, usePaginationFragment } from "react-relay";
import { toast } from "sonner";
import type { productsList_products$key } from "@/__generated_ecommerce__/productsList_products.graphql";
import page from "@/app/(ecommerce)/page";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useCategoryFilterParam } from "@/hooks/use-category-filter-param";
import { usePriceFilterParam } from "@/hooks/use-price-filter-param";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";
import ProductCard from "./product";

const ITEMS_PER_PAGE = 10;

export const ProductsListFragment = graphql`
	fragment productsList_products on Query
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 10 }
		after: { type: "String" }
		categories: { type: "[String]" }
		minPrice: { type: "Int",defaultValue:0 }
		maxPrice: { type: "Int",defaultValue:10000 }
		search: { type: "String", defaultValue: "" }	
	)
	@refetchable(queryName: "ProductsListRefetchQuery")
	 {
		products(first: $first, after: $after,categories: $categories, minPrice: $minPrice, maxPrice: $maxPrice, search: $search)
			@connection(key: "ProductsList_products" filters: ["categories","minPrice","maxPrice","search"]) {
			edges {
				node {
					...product_product
				}
			}
			pageInfo {
				startCursor
				endCursor
				hasNextPage
				hasPreviousPage
			}
			count
		}
	}
`;

interface Props {
	fragmentRef: productsList_products$key;
}

export const ProductsList = ({ fragmentRef }: Props) => {
	const { data, isLoadingNext, refetch, hasNext, loadNext } =
		usePaginationFragment(ProductsListFragment, fragmentRef);

	const { categories } = useCategoryFilterParam();
	const { minPrice, maxPrice } = usePriceFilterParam();

	const total = data?.products?.count || 0;

	const paginatedProducts = data?.products.edges;
	useEffect(() => {
		refetch(
			{
				first: ITEMS_PER_PAGE,
				after: null, // reset paginação
				categories: categories ?? [],
				minPrice: minPrice ?? 0,
				maxPrice: maxPrice ?? 10000,
			},
			{ fetchPolicy: "network-only" },
		);
	}, [categories, minPrice, maxPrice]);

	if (isLoadingNext) {
		return <LoadingSkeleton />;
	}

	return (
		<div className="w-full">
			<div>
				<p className="mb-4 text-slate-600 text-sm dark:text-slate-400">
					Mostrando {paginatedProducts.length} de {total} produtos
				</p>
			</div>
			<div className="m-auto grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{isLoadingNext ? (
					<LoadingSkeleton />
				) : (
					paginatedProducts.map(({ node }, i) => (
						<ProductCard key={i} product={node} />
					))
				)}
			</div>

			<div className="mt-4 flex justify-center">
				<Button
					variant="secondary"
					disabled={!hasNext}
					onClick={() => loadNext(ITEMS_PER_PAGE)}
				>
					Carregar mais
				</Button>
			</div>
		</div>
	);
};

const LoadingSkeleton = () => {
	return (
		<Card className="grid w-full flex-row gap-6 border-none bg-inherit pt-0 md:grid-cols-3 lg:grid-cols-4">
			{Array.from({ length: 8 }, (_, i) => (
				<div
					key={i}
					className="w-full min-w-30 flex-1 animate-pulse rounded-lg border"
				>
					<Skeleton className="h-48 w-full rounded-md bg-muted" />
					<div className="p-2">
						<Skeleton className="mt-2 h-4 w-3/4 rounded-md bg-muted" />
						<Skeleton className="mt-1 h-4 w-full rounded-md bg-muted" />
						<Skeleton className="mt-1 h-4 w-1/2 rounded-md bg-muted" />
						<Skeleton className="mt-2 h-8 w-full bg-primary" />
					</div>
				</div>
			))}
		</Card>
	);
};
