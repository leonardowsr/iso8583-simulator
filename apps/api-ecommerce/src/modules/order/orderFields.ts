/** biome-ignore-all lint/suspicious/noExplicitAny: change any after */

import type {
	BaseContext,
	FilteredConnectionArguments,
} from "@entria/graphql-mongo-helpers/lib/createLoader";
import { connectionArgs } from "graphql-relay";
import { OrderLoader } from "./OrderLoader";
import type { IOrder } from "./OrderModel";
import { OrderConnection, OrderType } from "./OrderType";

type OrderConnectionArgs = FilteredConnectionArguments;
type OrderContext = BaseContext<"OrderLoader", IOrder>;

export const orderField = (key: string) => ({
	[key]: {
		type: OrderType,
		resolve: async (
			obj: Record<string, unknown>,
			_unused: unknown,
			context: OrderContext,
		) => OrderLoader.load(context, obj.order as string),
	},
});

export const orderConnectionField = (key: string) => ({
	[key]: {
		type: OrderConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (
			_: unknown,
			args: OrderConnectionArgs,
			context: OrderContext,
		) => {
			return await OrderLoader.loadAll(context, args);
		},
	},
});
