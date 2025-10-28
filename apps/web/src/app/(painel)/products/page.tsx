import type { SearchParams } from "nuqs/server";
import { graphql } from "react-relay";
import pageProductsQuery, {
	type pageProductsQuery as PageProductsQueryType,
} from "@/__generated__/pageProductsQuery.graphql";
import { ProductsLayout } from "@/components/layout/products-layout";
import { loadCategoriasParams } from "@/hooks/use-category-filter-param";
import { withHydration } from "@/relay/with-hidratation";

export const pageProductsQueryConst = graphql`
	query pageProductsQuery($first: Int = 20, $after: String) {
		...productsList_products @arguments(first: $first, after: $after)
		...sidebarFilters_categories 
	}
`;

type PageProps = {
	searchParams: Promise<SearchParams>;
};
export default async function Page({ searchParams }: PageProps) {
	const { categories } = await loadCategoriasParams(searchParams);
	console.log("categories no page products", categories);
	return withHydration({
		Component: ProductsLayout,
		query: pageProductsQuery,
		variables: { first: 20, categories: categories || [] },
	});
}
