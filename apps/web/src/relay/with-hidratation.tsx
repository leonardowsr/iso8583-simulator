import type { ConcreteRequest } from "relay-runtime";
import { getPreloadedQuery } from "@/relay/network";
import { RelayHydrate } from "@/relay/RelayHydrate";

export async function withHydration<T>({
	Component,
	query,
	variables = {},
}: {
	Component: React.ComponentType<T>;
	query: ConcreteRequest;
	// biome-ignore lint/suspicious/noExplicitAny: no effect
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
