import type { Server } from "node:http";
import { URL } from "node:url";
import type { GraphQLSchema } from "graphql";
import { execute, parse, subscribe, validate } from "graphql";
import { useServer } from "graphql-ws/lib/use/ws";
import type { WebSocket } from "ws";
import { WebSocketServer } from "ws";

type CreateGraphQLServerOptions = {
	schema: GraphQLSchema;
	context: (() => unknown) | Record<string, unknown>;
};

export const createGraphqlWs = (
	server: Server,
	path: string,
	options: CreateGraphQLServerOptions,
) => {
	const wss = new WebSocketServer({
		noServer: true,
		handleProtocols: (protocols) => {
			// Accept graphql-transport-ws protocol
			if (protocols.has("graphql-transport-ws")) {
				return "graphql-transport-ws";
			}
			return false;
		},
	});

	useServer(
		{
			schema: options.schema,
			execute,
			subscribe,
			context: async () => {
				if (typeof options.context === "function") {
					return options.context();
				}

				return options.context;
			},
			onConnect: () => {
				// eslint-disable-next-line no-console
				console.info(`✅ Connected to ${path} WebSocket`);
				
			},
			onSubscribe: async (_, message) => {
				const { operationName, query, variables } = message.payload;

				const document = typeof query === "string" ? parse(query) : query;

				const args = {
					schema: options.schema,
					operationName,
					document,
					variableValues: variables,
				};

				const validationErrors = validate(args.schema, args.document);

				if (validationErrors.length > 0) {
					return validationErrors;
				}

				return args;
			},
		},
		wss,
	);

	server.on("upgrade", (request, socket, head) => {
		const url = new URL(request.url || "", `http://${request.headers.host}`);
		const { pathname } = url;

		if (pathname === path) {
			wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
				wss.emit("connection", ws, request);
			});
		} else {
			socket.destroy();
		}
	});
};
