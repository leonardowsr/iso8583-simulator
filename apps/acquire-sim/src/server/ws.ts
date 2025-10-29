/** biome-ignore-all lint/suspicious/noExplicitAny: no effect */
import { execute, parse, subscribe, validate } from "graphql";
import { useServer } from "graphql-ws/lib/use/ws";

import { schema } from "../schema/schema";
import { getContext } from "./getContext";

export type ConnectionParams = { Authorization: string };

type WsContext = {
	connectionInitReceived: boolean;
	acknowledged: boolean;
	subscriptions: any;
	extra: { socket: [WebSocket]; request: any };
	connectionParams: ConnectionParams;
};

export const ws = async (ctx: any) => {
	if (ctx.wss) {
		// handle upgrade
		const client = await ctx.ws();

		useServer(
			{
				schema,
				context: async (_wsContext: WsContext) => getContext(),
				execute,
				subscribe,
				// @ts-expect-error
				onConnect: async (_wsContext: WsContext) => {},
				// @ts-expect-error
				onSubscribe: async (_wsContext: WsContext, message) => {
					const { operationName, query, variables } = message.payload;

					const document = typeof query === "string" ? parse(query) : query;

					const args = {
						schema,
						contextValue: {},
						operationName,
						document,
						variableValues: variables,
					};

					const validationErrors = validate(args.schema, args.document);

					if (validationErrors.length > 0) {
						return validationErrors; // return `GraphQLError[]` to send `ErrorMessage` and stop Subscription
					}

					return args;
				},

				onError: (ctx, msg, errors) => {
					console.error("Error", { ctx, msg, errors });
				},
				onComplete: (ctx, msg) => {
					console.info("Complete", { ctx, msg });
				},
			},
			ctx.wss,
		);

		// connect to websocket
		ctx.wss.emit("connection", client, ctx.req);
	}
};
