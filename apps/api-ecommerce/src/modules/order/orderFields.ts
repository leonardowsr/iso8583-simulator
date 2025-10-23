/** biome-ignore-all lint/suspicious/noExplicitAny: change any after */
import { connectionArgs } from "graphql-relay";
import { OrderLoader } from "./OrderLoader";
import { OrderConnection, OrderType } from "./OrderType";

export const orderField = (key: string) => ({
	[key]: {
		type: OrderType,
		resolve: async (obj: Record<string, unknown>, _: any, context: any) =>
			OrderLoader.load(context, obj.order as string),
	},
});

export const orderConnectionField = (key: string) => ({
	[key]: {
		type: OrderConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (_: any, args: any, context: any) => {
			return await OrderLoader.loadAll(context, args);
		},
	},
});
