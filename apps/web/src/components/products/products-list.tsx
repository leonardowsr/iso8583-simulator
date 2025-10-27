import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { usePaginateParam } from "@/hooks/use-paginate-param";
import { useProducts } from "@/hooks/use-products";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import ProductCard from "./product";

const ITEMS_PER_PAGE = 20;

export const ProductsList = () => {
	const { page, setPage } = usePaginateParam();
	const { data: products = [], isLoading } = useProducts();
	const total = products.length;
	const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
	const currentPage = Math.max(1, Math.min(page, totalPages));
	const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedProducts = products.slice(startIdx, startIdx + ITEMS_PER_PAGE);

	const getPages = () => {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	};

	if (isLoading) {
		return <LoadingSkeleton />;
	}
	return (
		<div className="w-full">
			<div className="m-auto grid w-full not-first:grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
				{isLoading ? (
					<LoadingSkeleton />
				) : (
					paginatedProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))
				)}
			</div>
			{totalPages > 1 && (
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
			)}
		</div>
	);
};

const LoadingSkeleton = () => {
	// uma lista de skeleton

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
