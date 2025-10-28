import type { SearchParams } from "nuqs/server";
import { graphql } from "react-relay";
import pageProductsQuery, {
	type pageProductsQuery as PageProductsQueryType,
} from "@/__generated_ecommerce__/pageProductsQuery.graphql";
import { ProductsLayout } from "@/components/(ecommerce)/layout/products-layout";
import { loadCategoriasParams } from "@/lib/paramsProductServer";
import { withHydration } from "@/relay/with-hidratation";

export const pageProductsQueryConst = graphql`
  query pageProductsQuery(
    $first: Int
    $after: String
    $categories: [String!]
    $minPrice: Int
    $maxPrice: Int
  ) {
    ...productsList_products
      @arguments(
        first: $first
        after: $after
        categories: $categories
        minPrice: $minPrice
        maxPrice: $maxPrice
      )

    ...sidebarFilters_categories
  }
`;

type PageProps = {
	searchParams: Promise<SearchParams>;
};
export default async function Page({ searchParams }: PageProps) {
	const { categories, maxPrice, minPrice } =
		await loadCategoriasParams(searchParams);
	return withHydration({
		Component: ProductsLayout,
		query: pageProductsQuery,
		variables: {
			first: 10,
			categories: categories || [],
			maxPrice,
			minPrice,
		},
	});
}
