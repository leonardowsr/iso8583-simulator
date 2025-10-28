import { Environment, RecordSource, Store } from "relay-runtime";

import {
	createNetwork,
	GRAPHQL_ENDPOINT_ACQUIRER,
	GRAPHQL_ENPOINT,
} from "./network";

const IS_SERVER = typeof window === typeof undefined;
const CLIENT_DEBUG = false;
const SERVER_DEBUG = false;

function createEnvironment(graphqlEndpoint = GRAPHQL_ENPOINT) {
	const network = createNetwork(graphqlEndpoint);
	const environment = new Environment({
		network,
		store: new Store(new RecordSource(), {}),
		isServer: IS_SERVER,
		log(event) {
			if ((IS_SERVER && SERVER_DEBUG) || (!IS_SERVER && CLIENT_DEBUG)) {
				console.debug("[relay environment event]", event);
			}
		},
	});

	// @ts-expect-error Private API Hackery? 🤷‍♂️
	environment.getNetwork().responseCache = network.responseCache;

	return environment;
}

let clientEnvironment: ReturnType<typeof createEnvironment> | null = null;
let clientEnvironmentAcquirer: ReturnType<typeof createEnvironment> | null =
	null;

function getClientEnvironment() {
	if (!clientEnvironment) {
		clientEnvironment = createEnvironment();
	}
	return clientEnvironment;
}

function getClientEnvironmentAcquirer() {
	if (!clientEnvironmentAcquirer) {
		clientEnvironmentAcquirer = createEnvironment(GRAPHQL_ENDPOINT_ACQUIRER);
	}
	return clientEnvironmentAcquirer;
}

export {
	createEnvironment,
	getClientEnvironment,
	getClientEnvironmentAcquirer,
};
