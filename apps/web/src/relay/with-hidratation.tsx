import { getPreloadedQuery } from "@/relay/network";
import { RelayHydrate } from "@/relay/RelayHydrate";

export async function withHydration<T>({
	Component,
	query,
	variables = {},
}: {
	Component: React.ComponentType<any>;
	query: any;
	variables?: Record<string, any>;
}) {
	const preloaded = await getPreloadedQuery(query, variables);

	return (
		<RelayHydrate
			Component={Component}
			props={{
				preloadedQueries: {
					[query.params.name]: preloaded,
				},
			}}
		/>
	);
}
