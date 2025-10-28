"use client";
import { useEffect } from "react";
import { graphql, usePaginationFragment } from "react-relay";
import type { productsList_products$key } from "@/__generated__/productsList_products.graphql";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { useCategoryFilterParam } from "@/hooks/use-category-filter-param";
import { usePaginateParam } from "@/hooks/use-paginate-param";
import { usePriceFilterParam } from "@/hooks/use-price-filter-param";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import ProductCard from "./product";

const ITEMS_PER_PAGE = 20;

export const ProductsListFragment = graphql`
	fragment productsList_products on Query
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 10 }
		after: { type: "String" }
		categories: { type: "[String]" }
		minPrice: { type: "Int" }
		maxPrice: { type: "Int" }
		search: { type: "String" }	
	)
	@refetchable(queryName: "ProductsListRefetchQuery")
	 {
		products(first: $first, after: $after,categories: $categories, minPrice: $minPrice, maxPrice: $maxPrice, search: $search)
			@connection(key: "ProductsList_products") {
			edges {
				node {
					id
					name
					description
					price
					images
					createdAt
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
	const { data, isLoadingNext, refetch } = usePaginationFragment(
		ProductsListFragment,
		fragmentRef,
	);

	const { page, setPage } = usePaginateParam();
	const { categories } = useCategoryFilterParam();
	const { minPrice, maxPrice } = usePriceFilterParam();
	const total = data?.products?.count || 0;
	const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
	const currentPage = Math.max(1, Math.min(page, totalPages));
	const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedProducts =
		data?.products.edges?.slice(startIdx, startIdx + ITEMS_PER_PAGE) || [];

	const getPages = () => {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	};

	if (isLoadingNext) {
		return <LoadingSkeleton />;
	}

	useEffect(() => {
		refetchData();
	}, [categories, minPrice, maxPrice]);
	console.log("paginatedProducts", data.products);
	const refetchData = () => {
		refetch({
			minPrice: minPrice || 0,
			maxPrice: maxPrice || 10000,
			categories,
			first: ITEMS_PER_PAGE,
			after: null,
		});
	};
	return (
		<div className="w-full">
			<div className="m-auto grid w-full not-first:grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{isLoadingNext ? (
					<LoadingSkeleton />
				) : (
					paginatedProducts.map(({ node }) => (
						<ProductCard key={node.id} product={node} />
					))
				)}
			</div>

			<Pagination className="mt-8">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={() => setPage(Math.max(1, currentPage - 1))}
							aria-disabled={currentPage === 1}
							tabIndex={currentPage === 1 ? -1 : 0}
						/>
					</PaginationItem>
					{getPages().map((p) => (
						<PaginationItem key={p}>
							<PaginationLink
								isActive={p === currentPage}
								onClick={() => setPage(Number(p))}
								aria-current={p === currentPage ? "page" : undefined}
							>
								{p}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationNext
							onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
							aria-disabled={currentPage === totalPages}
							tabIndex={currentPage === totalPages ? -1 : 0}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
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
