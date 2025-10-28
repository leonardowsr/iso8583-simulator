import { graphql } from "react-relay";
import pageProductDetailsQuery from "@/__generated_ecommerce__/pageProductDetailsQuery.graphql";
import ProductDetail from "@/components/(ecommerce)/products/product-details";
import { getPreloadedQuery } from "@/relay/network";
import { withHydration } from "@/relay/with-hidratation";

const productDetailsQuery = graphql`
		query pageProductDetailsQuery($slug: String!) {
			productBySlug(slug: $slug) {
				id
				name
				description
				price
				slug
				images
			}
		}
`;

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const preload = await getPreloadedQuery(
		pageProductDetailsQuery,
		{ slug: slug[0] },
		{ fetchPolicy: "store-or-network" },
	);

	return withHydration({
		Component: ProductDetail,
		query: pageProductDetailsQuery,
		variables: {
			slug: slug[0],
		},
	});
}
