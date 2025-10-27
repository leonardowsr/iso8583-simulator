import { useQuery } from "@tanstack/react-query";
import { PRODUCTS_LIST } from "@/constants/products";
import { useCategoryFilterParam } from "./use-category-filter-param";
import { usePriceFilterParam } from "./use-price-filter-param";

export const PRODUCTS_QUERY_KEY = "products";

export function useProducts() {
	const { categories } = useCategoryFilterParam();
	const { minPrice, maxPrice } = usePriceFilterParam();

	return useQuery({
		queryKey: [PRODUCTS_QUERY_KEY, { categories, minPrice, maxPrice }],
		queryFn: () => {
			let filtered = PRODUCTS_LIST;
			if (categories.length > 0) {
				filtered = filtered.filter((product) =>
					categories.includes(product.category.slug),
				);
			}
			if (minPrice !== undefined) {
				filtered = filtered.filter((product) => product.price >= minPrice);
			}
			if (maxPrice !== undefined) {
				filtered = filtered.filter((product) => product.price <= maxPrice);
			}
			return filtered;
		},
	});
}
