/** biome-ignore-all lint/suspicious/noExplicitAny: change any after */
import { connectionArgs } from "graphql-relay";
import { ProductLoader } from "./ProductLoader";
import { ProductConnection, ProductType } from "./ProductType";

export const productField = (key: string) => ({
	[key]: {
		type: ProductType,
		resolve: async (obj: Record<string, unknown>, _: any, context: any) =>
			ProductLoader.load(context, obj.product as string),
	},
});

export const productConnectionField = (key: string) => ({
	[key]: {
		type: ProductConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (_: any, args: any, context: any) => {
			return await ProductLoader.loadAll(context, args);
		},
	},
});
