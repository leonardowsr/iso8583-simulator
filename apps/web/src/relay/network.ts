import {
	type CacheConfig,
	type ConcreteRequest,
	Network,
	QueryResponseCache,
	type RequestParameters,
	type Variables,
} from "relay-runtime";
import { subscribe } from "./websocket";

export const GRAPHQL_ENPOINT = process.env
	.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string;
export const GRAPHQL_ENDPOINT_ACQUIRER = process.env
	.NEXT_PUBLIC_GRAPHQL_ENDPOINT_ACQUIRER as string;
const ONE_MINUTE_IN_MS = 60 * 1000;

function createNetwork(graphqlEndpoint: string) {
	const responseCache = new QueryResponseCache({
		size: 100,
		ttl: ONE_MINUTE_IN_MS,
	});

	async function fetchResponse(
		operation: RequestParameters,
		variables: Variables,
		cacheConfig: CacheConfig,
	) {
		const { id } = operation;

		const isQuery = operation.operationKind === "query";
		const forceFetch = cacheConfig?.force;

		if (isQuery && !forceFetch) {
			const fromCache = responseCache.get(id as string, variables);
			if (fromCache != null) {
				return Promise.resolve(fromCache);
			}
		}

		return networkFetch(operation, variables, graphqlEndpoint);
	}

	const network = Network.create(fetchResponse, subscribe);
	// @ts-expect-error Private API Hackery? 🤷‍♂️
	network.responseCache = responseCache;
	return network;
}
/**
 * Relay requires developers to configure a "fetch" function that tells Relay how to load
 * the results of GraphQL queries from your server (or other data source). See more at
 * https://relay.dev/docs/en/quick-start-guide#relay-environment.
 */

async function networkFetch(
	params: RequestParameters,
	variables: Variables,
	endpoint: string,
	headers?: HeadersInit,
) {
	// Fetch data from GraphQL API:
	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			...headers,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: params.text,
			variables,
		}),
	});

	// Get the response as JSON
	const json = await response.json();

	// GraphQL returns exceptions (for example, a missing required variable) in the "errors"
	// property of the response. If any exceptions occurred when processing the request,
	// throw an error to indicate to the developer what went wrong.
	if (Array.isArray(json.errors)) {
		throw new Error(
			`Error fetching GraphQL query '${
				params.name
			}' with variables '${JSON.stringify(variables)}': ${JSON.stringify(
				json.errors,
			)}`,
		);
	}

	// Otherwise, return the full payload.
	return json;
}

async function getPreloadedQuery(
	{ params }: ConcreteRequest,
	variables: Variables,
	headers?: HeadersInit,
) {
	const response = await networkFetch(
		params,
		variables,
		GRAPHQL_ENPOINT,
		headers,
	);
	return {
		params,
		variables,
		response,
	};
}

async function getPreloadedQueryAcquirer(
	{ params }: ConcreteRequest,
	variables: Variables,
	headers?: HeadersInit,
) {
	const response = await networkFetch(
		params,
		variables,
		GRAPHQL_ENDPOINT_ACQUIRER,
		headers,
	);
	return {
		params,
		variables,
		response,
	};
}

export { createNetwork, getPreloadedQuery, getPreloadedQueryAcquirer };
